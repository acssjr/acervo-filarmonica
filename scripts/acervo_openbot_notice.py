"""Build the Acervo WhatsApp notice and deliver it through the VPS MCP bridge."""

import json
import re
import struct
from html.parser import HTMLParser
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, urlopen


BRIDGE = 'http://whatsapp-mcp:47823/mcp'
SITE = 'acervo.filarmonica25demarco.com'


class ImageMetadata(HTMLParser):
    image = ''

    def handle_starttag(self, tag, attrs):
        meta = dict(attrs)
        if tag == 'meta' and meta.get('property') == 'og:image':
            self.image = meta.get('content', '')


def make_notice(page_url):
    page_url_parts = urlsplit(page_url)
    if (page_url_parts.scheme, page_url_parts.netloc) != ('https', SITE):
        raise ValueError('Link da partitura fora do Acervo.')
    parser = ImageMetadata()
    headers = {'User-Agent': 'AcervoDigital-OpenBot/1.0'}
    with urlopen(Request(page_url, headers=headers), timeout=15) as page:
        parser.feed(page.read(1024 * 1024).decode('utf-8'))
    image = urlsplit(parser.image)
    if (image.scheme, image.netloc, image.path) != ('https', SITE, page_url_parts.path + '/social-image.png'):
        raise ValueError('A página ainda não oferece o card específico desta partitura.')
    with urlopen(Request(parser.image, headers=headers), timeout=15) as card:
        image_header = card.read(24)
        if (card.geturl() != parser.image or card.headers.get_content_type() != 'image/png'
                or image_header[:8] != b'\x89PNG\r\n\x1a\n'
                or len(image_header) < 24 or struct.unpack('>II', image_header[16:24]) != (1200, 630)):
            raise ValueError('O card específico ainda está indisponível.')
    link = urlunsplit(page_url_parts._replace(query='', fragment=''))
    caption = f'🎺 *Nova partitura no Acervo*\nAbra o link para encontrar sua parte:\n{link}'
    return {'type': 'image', 'url': parser.image, 'caption': caption}


class Bridge:
    def __init__(self):
        self.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream',
        }
        init, session = self.request('initialize', {
            'protocolVersion': '2025-03-26',
            'capabilities': {},
            'clientInfo': {'name': 'Acervo Digital', 'version': '1.0'},
        }, 1)
        self.headers['MCP-Protocol-Version'] = init['protocolVersion']
        if session:
            self.headers['Mcp-Session-Id'] = session
        self.request('notifications/initialized', {})

    def request(self, method, params, call_id=None):
        payload = {'jsonrpc': '2.0', 'method': method, 'params': params}
        if call_id is not None:
            payload['id'] = call_id
        req = Request(BRIDGE, data=json.dumps(payload).encode(), headers=self.headers)
        with urlopen(req, timeout=75) as response:
            raw = response.read().decode()
            if not raw and call_id is None:
                return None, None
            if response.headers.get_content_type() == 'text/event-stream':
                raw = next((line[6:] for line in raw.splitlines() if line.startswith('data: ')), '')
            message = json.loads(raw)
            if 'error' in message:
                raise ValueError('O conector do WhatsApp recusou a operação.')
            return message.get('result'), response.headers.get('Mcp-Session-Id')

    def media(self, payload, dry_run):
        result, _ = self.request('tools/call', {
            'name': 'send_media_message',
            'arguments': {**payload, 'dry_run': dry_run},
        }, 2 if dry_run else 3)
        if not result or result.get('isError'):
            raise ValueError('O conector do WhatsApp não confirmou a operação.')
        content = next((item['text'] for item in result.get('content', []) if item.get('type') == 'text'), '')
        if not content:
            raise ValueError('O conector do WhatsApp retornou uma resposta vazia.')
        return json.loads(content)


def preflight(page_url, target):
    if not re.fullmatch(r'[0-9-]+@g\.us', target['jid']):
        raise ValueError('Destino do aviso inválido.')
    payload = {**make_notice(page_url), 'to': target['jid']}
    bridge = Bridge()
    response = bridge.media(payload, dry_run=True)
    if response.get('sent') is not False or response.get('recipient', {}).get('jid') != target['jid']:
        raise ValueError('O WhatsApp não reconheceu o grupo aprovado.')
    return bridge, payload

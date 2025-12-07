// ===== UPLOAD PASTA MODAL =====
// Modal para upload de pasta com múltiplas partes de partitura

import { useState, useEffect } from 'react';
import { useUI } from '@contexts/UIContext';
import { API } from '@services/api';
import CategoryIcon from '@components/common/CategoryIcon';

// Mapeamento completo: nome normalizado → nome correto/padrão
const nomesPadrao = {
  // Grade
  'grade': 'Grade',
  'score': 'Grade',
  'conductor': 'Grade',
  'full score': 'Grade',

  // Flautas
  'flautim': 'Flautim',
  'piccolo': 'Flautim',
  'flauta': 'Flauta',
  'flute': 'Flauta',

  // Requinta
  'requinta': 'Requinta',
  'requinta eb': 'Requinta',
  'eb clarinet': 'Requinta',

  // Clarinetes
  'clarinete bb': 'Clarinete Bb',
  'clarinete bb 1': 'Clarinete Bb 1',
  'clarinete bb 2': 'Clarinete Bb 2',
  'clarinete bb 3': 'Clarinete Bb 3',
  'clarinete': 'Clarinete Bb',
  'clarinete 1': 'Clarinete Bb 1',
  'clarinete 2': 'Clarinete Bb 2',
  'clarinete 3': 'Clarinete Bb 3',
  'clarineta bb': 'Clarinete Bb',
  'clarineta bb 1': 'Clarinete Bb 1',
  'clarineta bb 2': 'Clarinete Bb 2',
  'clarineta bb 3': 'Clarinete Bb 3',
  'clarineta': 'Clarinete Bb',
  'clarineta 1': 'Clarinete Bb 1',
  'clarineta 2': 'Clarinete Bb 2',
  'clarineta 3': 'Clarinete Bb 3',
  'clarinet': 'Clarinete Bb',
  'clarinet 1': 'Clarinete Bb 1',
  'clarinet 2': 'Clarinete Bb 2',
  'clarinet 3': 'Clarinete Bb 3',
  'bb clarinet': 'Clarinete Bb',
  'bb clarinet 1': 'Clarinete Bb 1',
  'bb clarinet 2': 'Clarinete Bb 2',
  'bb clarinet 3': 'Clarinete Bb 3',

  // Saxofones
  'sax soprano': 'Sax. Soprano',
  'sax. soprano': 'Sax. Soprano',
  'saxofone soprano': 'Sax. Soprano',
  'soprano sax': 'Sax. Soprano',
  'soprano saxophone': 'Sax. Soprano',

  'sax alto': 'Sax. Alto',
  'sax. alto': 'Sax. Alto',
  'sax alto 1': 'Sax. Alto 1',
  'sax. alto 1': 'Sax. Alto 1',
  'sax alto 2': 'Sax. Alto 2',
  'sax. alto 2': 'Sax. Alto 2',
  'saxofone alto': 'Sax. Alto',
  'alto sax': 'Sax. Alto',
  'alto sax 1': 'Sax. Alto 1',
  'alto sax 2': 'Sax. Alto 2',
  'alto saxophone': 'Sax. Alto',

  'sax tenor': 'Sax. Tenor',
  'sax. tenor': 'Sax. Tenor',
  'sax tenor 1': 'Sax. Tenor 1',
  'sax. tenor 1': 'Sax. Tenor 1',
  'sax tenor 2': 'Sax. Tenor 2',
  'sax. tenor 2': 'Sax. Tenor 2',
  'saxofone tenor': 'Sax. Tenor',
  'tenor sax': 'Sax. Tenor',
  'tenor sax 1': 'Sax. Tenor 1',
  'tenor sax 2': 'Sax. Tenor 2',
  'tenor saxophone': 'Sax. Tenor',

  'sax baritono': 'Sax. Barítono',
  'sax. baritono': 'Sax. Barítono',
  'saxofone baritono': 'Sax. Barítono',
  'baritone sax': 'Sax. Barítono',
  'baritono sax': 'Sax. Barítono',
  'bari sax': 'Sax. Barítono',
  'baritone saxophone': 'Sax. Barítono',

  // Trompetes
  'trompete bb': 'Trompete Bb',
  'trompete bb 1': 'Trompete Bb 1',
  'trompete bb 2': 'Trompete Bb 2',
  'trompete bb 3': 'Trompete Bb 3',
  'trompete': 'Trompete Bb',
  'trompete 1': 'Trompete Bb 1',
  'trompete 2': 'Trompete Bb 2',
  'trompete 3': 'Trompete Bb 3',
  'trumpet': 'Trompete Bb',
  'trumpet 1': 'Trompete Bb 1',
  'trumpet 2': 'Trompete Bb 2',
  'trumpet 3': 'Trompete Bb 3',
  'bb trumpet': 'Trompete Bb',
  'bb trumpet 1': 'Trompete Bb 1',
  'bb trumpet 2': 'Trompete Bb 2',
  'bb trumpet 3': 'Trompete Bb 3',
  'trumpet in bb': 'Trompete Bb',
  'trumpet in bb 1': 'Trompete Bb 1',
  'trumpet in bb 2': 'Trompete Bb 2',
  'trumpet in bb 3': 'Trompete Bb 3',

  // Trompas
  'trompa f': 'Trompa F',
  'trompa f 1': 'Trompa F 1',
  'trompa f 2': 'Trompa F 2',
  'trompa eb': 'Trompa Eb',
  'trompa eb 1': 'Trompa Eb 1',
  'trompa eb 2': 'Trompa Eb 2',
  'trompa': 'Trompa F',
  'trompa 1': 'Trompa F 1',
  'trompa 2': 'Trompa F 2',
  'horn': 'Trompa F',
  'horn 1': 'Trompa F 1',
  'horn 2': 'Trompa F 2',
  'french horn': 'Trompa F',
  'f horn': 'Trompa F',
  'eb horn': 'Trompa Eb',
  'horn in f': 'Trompa F',
  'horn in f 1': 'Trompa F 1',
  'horn in f 2': 'Trompa F 2',
  'horn in eb': 'Trompa Eb',
  'horn in eb 1': 'Trompa Eb 1',
  'horn in eb 2': 'Trompa Eb 2',

  // Barítonos
  'baritono bb': 'Barítono Bb',
  'baritono bb 1': 'Barítono Bb 1',
  'baritono bb 2': 'Barítono Bb 2',
  'baritono': 'Barítono Bb',
  'baritono 1': 'Barítono Bb 1',
  'baritono 2': 'Barítono Bb 2',
  'baritone': 'Barítono Bb',
  'baritone 1': 'Barítono Bb 1',
  'baritone 2': 'Barítono Bb 2',
  'baritone tc': 'Barítono Bb',
  'baritone bc': 'Barítono Bb',

  // Trombones
  'trombone': 'Trombone',
  'trombone 1': 'Trombone 1',
  'trombone 2': 'Trombone 2',
  'trombone 3': 'Trombone 3',

  // Bombardinos
  'bombardino': 'Bombardino',
  'bombardino bb': 'Bombardino',
  'bombardino c': 'Bombardino',
  'bombardino eb': 'Bombardino',
  'euphonium': 'Bombardino',
  'euphonium 1': 'Bombardino',
  'euphonium 2': 'Bombardino',

  // Tubas/Baixos
  'baixo eb': 'Baixo Eb',
  'baixo bb': 'Baixo Bb',
  'baixo': 'Baixo Eb',
  'tuba': 'Baixo Eb',
  'tuba eb': 'Baixo Eb',
  'tuba bb': 'Baixo Bb',
  'bass': 'Baixo Eb',
  'eb bass': 'Baixo Eb',
  'bb bass': 'Baixo Bb',

  // Percussão
  'caixa': 'Caixa',
  'caixa clara': 'Caixa',
  'caixa-clara': 'Caixa',
  'snare': 'Caixa',
  'snare drum': 'Caixa',
  'caixa ferro tamborim': 'Caixa',
  'caixa-ferro-tamborim': 'Caixa',
  'caixa e tamborim': 'Caixa',
  'tamborim': 'Caixa',

  'bombo': 'Bombo',
  'bumbo': 'Bombo',
  'bass drum': 'Bombo',

  'pratos': 'Pratos',
  'prato': 'Pratos',
  'cymbals': 'Pratos',
  'cymbal': 'Pratos',

  'percussao': 'Percussão',
  'percussion': 'Percussão',
  'drums': 'Percussão',
  'bateria': 'Percussão',
  'drum set': 'Percussão'
};

// Normaliza texto (remove acentos, padroniza)
const normalizarTexto = (texto) => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_\-.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Extrai instrumento do nome do arquivo
const extrairInstrumento = (nomeArquivo) => {
  let nome = nomeArquivo.replace(/\.pdf$/i, '');
  nome = nome.replace(/^\d+[\s\-_\.]*/, '');
  // Usar \s+ (1+ espaços) para não quebrar nomes com hífen como "Caixa-clara"
  nome = nome.replace(/^.+\s+-\s+/, '');

  const matchNumero = nome.match(/\s+(\d+)$/);
  const numeroFinal = matchNumero ? matchNumero[1] : null;
  const nomeBase = nome.replace(/\s+\d+$/, '').trim();
  const nomeNormalizado = normalizarTexto(nomeBase);

  const adicionarNumero = (instrumento) => {
    if (numeroFinal && !/\d$/.test(instrumento)) {
      return `${instrumento} ${numeroFinal}`;
    }
    return instrumento;
  };

  if (nomesPadrao[nomeNormalizado]) {
    return { instrumento: adicionarNumero(nomesPadrao[nomeNormalizado]), reconhecido: true };
  }

  const chaves = Object.keys(nomesPadrao).sort((a, b) => b.length - a.length);
  for (const chave of chaves) {
    if (nomeNormalizado.includes(chave) || nomeNormalizado.endsWith(chave)) {
      return { instrumento: adicionarNumero(nomesPadrao[chave]), reconhecido: true };
    }
  }

  return { instrumento: nome.trim(), reconhecido: false };
};

// Parseia nome da pasta para extrair título, categoria, compositor
const parsearNomePasta = (nome) => {
  const partes = nome.split(/\s*-\s*/);
  let titulo = '';
  let categoriaDetectada = '';
  let compositor = '';
  let arranjador = '';
  let temArranjador = false;

  if (partes.length > 0) {
    titulo = partes[0].trim();
  }

  const categoriasConhecidas = ['dobrado', 'marcha', 'valsa', 'fantasia', 'polaca', 'bolero', 'hino', 'marcha funebre', 'marcha funébre', 'preludio', 'prelúdio'];

  for (let i = 1; i < partes.length; i++) {
    const parte = partes[i].trim();
    const parteLower = parte.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (/^arr[:\s]/i.test(parte) || /arranjo/i.test(parte)) {
      arranjador = parte.replace(/^(arr[:\s]*|arranjo[\.\:\s]*)/i, '').trim();
      temArranjador = true;
    } else if (categoriasConhecidas.some(cat => parteLower === cat || parteLower.includes(cat))) {
      categoriaDetectada = parte;
    } else if (!compositor) {
      compositor = parte;
    }
  }

  if (temArranjador && !categoriaDetectada) {
    categoriaDetectada = 'Arranjo';
  }

  return { titulo, categoriaDetectada, compositor, arranjador };
};

// Detecta categoria pelo nome
const detectarCategoria = (nome, categorias) => {
  const nomeNorm = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const mapeamento = {
    'dobrado': 'dobrado',
    'marcha funebre': 'marcha-funebre',
    'marcha fúnebre': 'marcha-funebre',
    'marcha': 'marcha',
    'valsa': 'valsa',
    'fantasia': 'fantasia',
    'polaca': 'polaca',
    'bolero': 'bolero',
    'hino religioso': 'hino-religioso',
    'hino': 'hino',
    'preludio': 'preludio',
    'prelúdio': 'preludio',
    'arranjo': 'arranjo'
  };

  const termos = Object.keys(mapeamento).sort((a, b) => b.length - a.length);

  for (const termo of termos) {
    if (nomeNorm.includes(termo)) {
      return mapeamento[termo];
    }
  }

  return categorias[0]?.id || 'dobrado';
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1.5px solid var(--border)',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  fontFamily: 'Outfit, sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const UploadPastaModal = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useUI();
  const [files, setFiles] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Campos editáveis
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [compositor, setCompositor] = useState('');
  const [arranjador, setArranjador] = useState('');
  const [ano, setAno] = useState('');
  const [showCatDropdown, setShowCatDropdown] = useState(false);

  // Contadores
  const reconhecidos = parsedData.filter(p => p.reconhecido).length;
  const naoReconhecidos = parsedData.filter(p => !p.reconhecido).length;

  // Carrega categorias
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const cats = await API.getCategorias();
        setCategorias(cats || []);
      } catch (_e) {
        console.error('Erro ao carregar categorias');
      }
    };
    if (isOpen) loadCategorias();
  }, [isOpen]);

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setFiles([]);
      setFolderName('');
      setParsedData([]);
      setTitulo('');
      setCategoria('');
      setCompositor('');
      setArranjador('');
      setAno('');
    }
  }, [isOpen]);

  // Processa os arquivos quando selecionados
  const handleFolderSelect = (e) => {
    const fileList = Array.from(e.target.files);
    if (fileList.length === 0) return;

    const pdfFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      showToast('Nenhum arquivo PDF encontrado na pasta', 'error');
      return;
    }

    setFiles(pdfFiles);

    const firstPath = pdfFiles[0].webkitRelativePath || pdfFiles[0].name;
    const pathParts = firstPath.split('/');
    const pastaName = pathParts.length > 1 ? pathParts[0] : 'Pasta sem nome';
    setFolderName(pastaName);

    const { titulo: tit, categoriaDetectada, compositor: comp, arranjador: arr } = parsearNomePasta(pastaName);
    setTitulo(tit);
    setCompositor(comp);
    setArranjador(arr || '');

    let catId;
    if (categoriaDetectada && categoriaDetectada.toLowerCase() === 'arranjo') {
      catId = 'arranjo';
    } else {
      catId = detectarCategoria(categoriaDetectada || pastaName, categorias);
    }
    setCategoria(catId);

    const parsed = pdfFiles.map(file => {
      const { instrumento, reconhecido } = extrairInstrumento(file.name);
      return {
        file,
        nomeOriginal: file.name,
        instrumento,
        reconhecido
      };
    });

    setParsedData(parsed);
  };

  // Upload
  const handleUpload = async () => {
    if (!titulo.trim()) {
      showToast('Título é obrigatório', 'error');
      return;
    }
    if (!categoria) {
      showToast('Categoria é obrigatória', 'error');
      return;
    }
    if (parsedData.length === 0) {
      showToast('Nenhum arquivo para enviar', 'error');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('titulo', titulo.trim());
      formData.append('compositor', compositor.trim());
      formData.append('arranjador', arranjador.trim());
      formData.append('categoria', categoria);
      formData.append('ano', ano);
      formData.append('total_arquivos', parsedData.length.toString());

      parsedData.forEach((item, index) => {
        formData.append(`arquivo_${index}`, item.file);
        formData.append(`instrumento_${index}`, item.instrumento);
      });

      const result = await API.uploadPastaPartitura(formData);

      showToast(result.message || 'Partitura criada com sucesso!');
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast(err.message || 'Erro no upload', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const selectedCat = categorias.find(c => c.id === categoria);

  return (
    <div onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        padding: '24px',
        overflow: 'auto',
        fontFamily: 'Outfit, sans-serif'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload de Pasta
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Selecione uma pasta contendo os PDFs das partes da partitura
        </p>

        {/* Seletor de pasta */}
        <div style={{
          border: '2px dashed var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '30px',
          textAlign: 'center',
          marginBottom: '20px',
          background: 'var(--bg-primary)',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}>
          <input
            type="file"
            webkitdirectory=""
            directory=""
            multiple
            onChange={handleFolderSelect}
            style={{ display: 'none' }}
            id="folder-input"
          />
          <label htmlFor="folder-input" style={{ cursor: 'pointer', display: 'block' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📂</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {folderName || 'Clique para selecionar uma pasta'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {files.length > 0 ? `${files.length} arquivo(s) PDF encontrado(s)` : 'Padrão: "Título - Categoria - Compositor"'}
            </div>
          </label>
        </div>

        {/* Preview dos dados detectados */}
        {parsedData && parsedData.length > 0 && (
          <>
            {/* Campos editáveis */}
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Dados da Partitura (edite se necessário)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Título *
                  </label>
                  <input type="text" style={inputStyle} value={titulo} onChange={e => setTitulo(e.target.value)} />
                </div>

                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Categoria *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCatDropdown(!showCatDropdown)}
                    style={{
                      ...inputStyle, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {selectedCat && (
                        <span style={{
                          width: '20px', height: '20px', borderRadius: '4px',
                          background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '1px solid rgba(212, 175, 55, 0.2)'
                        }}>
                          <CategoryIcon categoryId={selectedCat.id} size={12} color="#D4AF37" />
                        </span>
                      )}
                      {selectedCat ? selectedCat.nome : 'Selecione...'}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
                      transform: showCatDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {showCatDropdown && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
                      borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      zIndex: 20, maxHeight: '200px', overflowY: 'auto'
                    }}>
                      {categorias.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { setCategoria(cat.id); setShowCatDropdown(false); }}
                          style={{
                            width: '100%', padding: '10px 12px', border: 'none',
                            background: categoria === cat.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                            color: categoria === cat.id ? '#D4AF37' : 'var(--text-primary)',
                            fontSize: '13px', textAlign: 'left', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'background 0.15s'
                          }}
                        >
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '4px',
                            background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(212, 175, 55, 0.2)'
                          }}>
                            <CategoryIcon categoryId={cat.id} size={12} color="#D4AF37" />
                          </span>
                          {cat.nome}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Compositor
                  </label>
                  <input type="text" style={inputStyle} value={compositor} onChange={e => setCompositor(e.target.value)} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Arranjador
                  </label>
                  <input type="text" style={inputStyle} value={arranjador} onChange={e => setArranjador(e.target.value)} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Ano
                  </label>
                  <input type="number" style={inputStyle} placeholder="Ex: 1950" value={ano} onChange={e => setAno(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Lista de arquivos detectados */}
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"/>
                    <circle cx="6" cy="18" r="3"/>
                    <circle cx="18" cy="16" r="3"/>
                  </svg>
                  Partes Detectadas
                </h3>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                  <span style={{ color: '#27ae60', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {reconhecidos} reconhecido(s)
                  </span>
                  {naoReconhecidos > 0 && (
                    <span style={{ color: '#e67e22', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      {naoReconhecidos} não reconhecido(s)
                    </span>
                  )}
                </div>
              </div>

              <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {parsedData.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '6px',
                    border: item.reconhecido ? '1px solid var(--border)' : '1px solid #e67e22'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                      <span style={{ color: item.reconhecido ? '#27ae60' : '#e67e22', display: 'flex', alignItems: 'center' }}>
                        {item.reconhecido ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                        )}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.nomeOriginal}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      background: item.reconhecido ? 'rgba(39, 174, 96, 0.1)' : 'rgba(230, 126, 34, 0.1)',
                      color: item.reconhecido ? '#27ae60' : '#e67e22',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      → {item.instrumento}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Botões */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '14px', borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-primary)', border: '1px solid var(--border)',
            color: 'var(--text-primary)', fontSize: '14px', cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || !parsedData || parsedData.length === 0}
            style={{
              flex: 1, padding: '14px', borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
              border: 'none',
              color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif',
              opacity: (uploading || !parsedData || parsedData.length === 0) ? 0.6 : 1
            }}
          >
            {uploading ? 'Enviando...' : `📤 Fazer Upload (${parsedData?.length || 0} arquivos)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPastaModal;

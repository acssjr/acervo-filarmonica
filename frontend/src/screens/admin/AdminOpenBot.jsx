import { useCallback, useEffect, useState } from 'react';
import { API } from '@services/api';
import { useUI } from '@contexts/UIContext';
import './admin-editaveis.css';

const status = {
  pendente: 'Aguardando decisão', executando: 'Executando', concluida: 'Concluída',
  recusada: 'Recusada', falhou: 'Falhou', incerta: 'Confira o resultado no painel', expirada: 'Expirada'
};

export default function AdminOpenBot() {
  const { showToast } = useUI();
  const [operations, setOperations] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setError('');
    try {
      setOperations(await API.getOpenBotOperacoes());
    } catch (err) {
      setError(err.message);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function decide(id, acao) {
    setBusy(true);
    try {
      const result = await API.decidirOpenBotOperacao(id, acao);
      showToast(status[result.estado], result.estado === 'concluida' || result.estado === 'recusada' ? 'success' : 'error');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      await load();
      setBusy(false);
    }
  }

  return (
    <section className="admin-editaveis" aria-labelledby="openbot-title">
      <header>
        <h1 id="openbot-title">Aprovações do OpenBot</h1>
        <p>Confira os dados de cada alteração antes de aprovar.</p>
      </header>
      <button disabled={busy} onClick={load}>Atualizar lista</button>
      {error ? <p role="alert">{error}</p> : operations === null && <p role="status">Carregando operações…</p>}
      {operations?.length === 0 && <p>Nenhuma operação solicitada.</p>}
      {operations?.map(op => (
        <article className="admin-editaveis-panel" key={op.id}>
          <h2>{op.metodo} {op.destino}</h2>
          <p>{status[op.estado]} · {new Date(op.criado_em).toLocaleString('pt-BR')}</p>
          <small>Solicitação {op.id}</small>
          {op.dados !== null && <pre>{JSON.stringify(op.dados, null, 2)}</pre>}
          {op.resultado?.error && <p role="alert">{op.resultado.error}</p>}
          {op.estado === 'pendente' && (
            <div>
              <button disabled={busy} onClick={() => decide(op.id, 'aprovar')}>Aprovar e executar</button>{' '}
              <button disabled={busy} onClick={() => decide(op.id, 'recusar')}>Recusar</button>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}

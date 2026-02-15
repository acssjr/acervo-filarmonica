// ===== FUNCOES DE FORMATACAO =====

export const formatTimeAgo = (dateString: string | Date, short = false): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (short) {
    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return "ontem";
    if (diffDays < 7) return `${diffDays}d`;
    return `${Math.floor(diffDays / 7)}sem`;
  }

  if (diffMins < 1) return "agora mesmo";
  if (diffMins < 60) return `${diffMins} min atras`;
  if (diffHours < 24) return `${diffHours}h atras`;
  if (diffDays === 1) return "ontem";
  if (diffDays < 7) return `${diffDays} dias atras`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semana(s) atras`;
  return `${Math.floor(diffDays / 30)} mes(es) atras`;
};

interface AtividadeInfo {
  action: string;
  color: string;
}

export const getAtividadeInfo = (tipo: string, short = false): AtividadeInfo => {
  const mapLong: Record<string, AtividadeInfo> = {
    nova_partitura: { action: "Nova partitura adicionada", color: "#43B97F" },
    download: { action: "Partitura baixada", color: "#5B8DEF" },
    favorito: { action: "Favorito adicionado", color: "#E54D87" },
  };

  const mapShort: Record<string, AtividadeInfo> = {
    nova_partitura: { action: "Nova partitura", color: "#43B97F" },
    download: { action: "Download", color: "#5B8DEF" },
    favorito: { action: "Favorito", color: "#E54D87" },
  };

  const map = short ? mapShort : mapLong;
  return map[tipo] || { action: tipo, color: "#999" };
};

export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return "0";
  return num.toLocaleString("pt-BR");
};

export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

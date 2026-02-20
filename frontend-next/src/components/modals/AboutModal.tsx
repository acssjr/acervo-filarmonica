"use client";

// ===== ABOUT MODAL =====
// Modal "Sobre" reutilizavel para ProfileScreen e AdminConfig

import useAnimatedVisibility from "@hooks/useAnimatedVisibility";

// --- Types ---

interface InfoCard {
  label: string;
  value: string;
  isHighlighted?: boolean;
}

interface ChangelogItem {
  bold?: string;
  text: string;
}

interface ChangelogVersion {
  version: string;
  isCurrent?: boolean;
  items: ChangelogItem[];
}

interface AboutConfig {
  subtitle: string;
  maxWidth?: number;
  infoCards: InfoCard[];
  footerText: string;
  showLegacyVersions?: boolean;
}

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtitle: string;
  maxWidth?: number;
  infoCards?: InfoCard[];
  changelog?: ChangelogVersion[];
  legacyVersions?: Record<string, string> | null;
  footerText: string;
}

// --- Changelog Data (Profile) ---

export const PROFILE_CHANGELOG: ChangelogVersion[] = [
  {
    version: "2.9.0",
    isCurrent: true,
    items: [
      { bold: "Compartilhar:", text: "Envie partituras via WhatsApp direto do app" },
      { bold: "Carrinho:", text: "Selecione várias partituras e baixe todas de uma vez" },
      { bold: "PDF:", text: "Pinch-to-zoom suave no visualizador de partituras" },
      { bold: "PWA:", text: "Ícones e favicon para instalar como app" },
      { bold: "Atualização:", text: "Notificação quando houver nova versão disponível" },
      { bold: "Busca:", text: "Resultados mais precisos (exige todas as palavras)" },
      { bold: "Instrumentos:", text: "Matching inteligente de tonalidades e vozes" },
    ],
  },
  {
    version: "2.8.0",
    items: [
      { bold: "Repertório:", text: "Sistema completo de download em lote e impressão" },
      { bold: "Download:", text: "Lista de instrumentos agora mostra todos os instrumentos reais das partituras" },
      { bold: "UI:", text: "Animações de hover nos botões administrativos" },
      { bold: "UX:", text: "Botão de repertório com resposta instantânea (UI otimista)" },
      { bold: "Admin:", text: "Modal para selecionar/criar repertório ao adicionar partitura" },
    ],
  },
  {
    version: "2.4.0",
    items: [
      { bold: "Super Admin:", text: "Protecao total do administrador master" },
      { bold: "Músicos:", text: "Badge Admin para identificar administradores" },
      { bold: "Login:", text: "Animação de equalizer musical no carregamento" },
      { bold: "Segurança:", text: "Super admin oculto da lista de músicos" },
      { bold: "Fix:", text: "Corrigido bug de zeros aparecendo nos nomes" },
    ],
  },
  {
    version: "2.3.3",
    items: [
      { bold: "Admin Toggle:", text: "Botão para alternar entre modo usuário e admin" },
      { bold: "Maestro:", text: "Detecção correta de maestro/regente para download de grade" },
      { bold: "Download:", text: "Botão desabilitado quando grade não disponível" },
      { bold: "Testes:", text: "214 testes automatizados passando" },
      { bold: "CI/CD:", text: "Pipeline GitHub Actions para testes e build" },
    ],
  },
  {
    version: "2.3.0",
    items: [
      { bold: "Notificações:", text: "Sistema real de notificações de novas partituras" },
      { bold: "Compositores:", text: "Carrossel de compositores em destaque na home" },
      { bold: "Compositores:", text: "Tela dedicada com cards e lista alfabética" },
      { bold: "Busca:", text: "Transliteração para grafias antigas (nymphas -> ninfas)" },
      { bold: "UI:", text: "Badge de notificações redesenhado" },
      { text: "Correções de acentuação em toda interface" },
    ],
  },
  {
    version: "2.2.0",
    items: [
      { bold: "Arquitetura:", text: "Contexts separados (Auth, UI, Data, Notifications)" },
      { bold: "Performance:", text: "Re-renders isolados por domínio" },
      { text: "30+ componentes migrados para nova arquitetura" },
    ],
  },
  {
    version: "2.1.0",
    items: [
      { bold: "Segurança:", text: "JWT com expiração de 24h" },
      { bold: "Segurança:", text: "Senhas criptografadas com PBKDF2" },
      { bold: "Segurança:", text: "Rate limiting contra ataques" },
      { bold: "Admin:", text: "Redirecionamento automático" },
      { text: "Toggle de tema no header admin" },
    ],
  },
  {
    version: "2.0.0",
    items: [
      { text: "Upload de pasta com múltiplas partes" },
      { text: "Detecção automática de instrumentos" },
      { text: "Gerenciamento de partes no admin" },
      { text: "Seletor de partes múltiplas no download" },
      { text: "Download direto ao selecionar instrumento" },
      { text: "Seção Em Destaque só com marcados" },
      { text: "Correção de bugs e melhorias gerais" },
    ],
  },
  {
    version: "1.5.0",
    items: [
      { text: "Modal Sobre com changelog" },
      { text: "Validação PIN não pode ser igual ao anterior" },
      { text: "Espaçamento entre cards no mobile" },
    ],
  },
  {
    version: "1.4.0",
    items: [
      { text: "Perfil completo: foto, edição de nome" },
      { text: "Alteração de PIN em 3 etapas" },
      { text: "Contato via WhatsApp" },
      { text: "Tema mobile: clique direto cicla opções" },
    ],
  },
  {
    version: "1.3.0",
    items: [
      { text: "Login com usuário + PIN de 4 dígitos" },
      { text: "Auto-login ao completar PIN" },
      { text: "Opção Lembrar meu acesso" },
      { text: "Otimização mobile para teclado virtual" },
    ],
  },
  {
    version: "1.2.0",
    items: [
      { text: "Tema: Claro, Escuro, Sistema" },
      { text: "Contador de próximo ensaio" },
      { text: "Tela de login com glassmorphism" },
    ],
  },
  {
    version: "1.1.0",
    items: [
      { text: "Modal de detalhes da partitura" },
      { text: "Seletor de 27 instrumentos" },
      { text: "Sistema de favoritos persistente" },
    ],
  },
  {
    version: "1.0.0",
    items: [
      { text: "Layout desktop com sidebar" },
      { text: "Toggle sidebar (260px - 72px)" },
      { text: "Filtros por gênero e compositor" },
      { text: "Grid responsivo de cards" },
    ],
  },
];

export const PROFILE_LEGACY_VERSIONS: Record<string, string> = {
  "0.9": "Notificações",
  "0.8": "Header Home",
  "0.7": "Cards em destaque",
  "0.6": "Favoritos, busca fuzzy",
  "0.5": "Tema claro/escuro",
  "0.4": "Painel Admin",
  "0.3": "Busca",
  "0.2": "Acervo",
  "0.1": "Versão inicial",
};

export const PROFILE_ABOUT_CONFIG: AboutConfig = {
  subtitle: "Sociedade Filarmônica 25 de Março",
  maxWidth: 420,
  infoCards: [
    { label: "Versão", value: "2.9.0" },
    { label: "Tecnologias", value: "React \u2022 JS \u2022 CSS" },
    { label: "Por", value: "Antonio Jr.", isHighlighted: true },
  ],
  footerText: "Feira de Santana - BA \u2022 Fundada em 1868",
  showLegacyVersions: true,
};

// --- Changelog Data (Admin) ---

export const ADMIN_CHANGELOG: ChangelogVersion[] = [
  {
    version: "2.9.0",
    isCurrent: true,
    items: [
      { bold: "Git Workflow:", text: "Commitlint + pre-commit hooks para qualidade" },
      { bold: "PR Template:", text: "Template padronizado para pull requests" },
      { bold: "Testes:", text: "Suite completa com Vitest + Playwright E2E" },
      { bold: "PDF:", text: "Visualizador com pinch-to-zoom suave" },
      { bold: "Instrumentos:", text: "Matching inteligente de tonalidades e vozes" },
      { bold: "Carrinho:", text: "Botão flutuante visível em todos navegadores" },
    ],
  },
  {
    version: "2.8.0",
    items: [
      { bold: "Repertório:", text: "Modal para selecionar/criar repertório ao adicionar partitura" },
      { bold: "UI:", text: "Animações de hover nos botões (escala + sombra)" },
      { bold: "UX:", text: "Botão de repertório com resposta instantânea (UI otimista)" },
      { bold: "Fix:", text: "Lista de instrumentos agora mostra todos os instrumentos reais" },
    ],
  },
  {
    version: "2.1.0",
    items: [
      { bold: "Segurança:", text: "Autenticação JWT com expiração de 24h" },
      { bold: "Segurança:", text: "Senhas criptografadas com PBKDF2" },
      { bold: "Segurança:", text: "Rate limiting para proteção contra ataques" },
      { bold: "Admin:", text: "Redirecionamento automático para /admin" },
      { bold: "Admin:", text: "Toggle de tema movido para o header" },
      { bold: "UX:", text: "Sessão expira com aviso ao usuário" },
      { text: "Melhorias de performance e correções de bugs" },
    ],
  },
  {
    version: "2.0.0",
    items: [
      { text: "Upload de pasta com múltiplas partes" },
      { text: "Detecção automática de instrumentos" },
      { text: "Gerenciamento de partes no admin" },
      { text: "Sistema de favoritos sincronizado" },
      { text: "Correção de bugs e melhorias gerais" },
    ],
  },
  {
    version: "1.0.0",
    items: [
      { text: "Painel administrativo completo" },
      { text: "Dashboard com estatísticas" },
      { text: "Gerenciamento de músicos" },
      { text: "Gerenciamento de partituras" },
      { text: "Gerenciamento de categorias" },
    ],
  },
];

export const ADMIN_ABOUT_CONFIG: AboutConfig = {
  subtitle: "Painel Administrativo",
  maxWidth: 480,
  infoCards: [
    { label: "Versão", value: "2.9.0" },
    { label: "Backend", value: "Cloudflare Workers" },
    { label: "Dev", value: "Antonio Jr.", isHighlighted: true },
  ],
  footerText: "S.F. 25 de Março \u2022 Feira de Santana, BA \u2022 Fundada em 1868",
  showLegacyVersions: false,
};

// --- Component ---

export function AboutModal({
  isOpen,
  onClose,
  subtitle,
  maxWidth = 420,
  infoCards = [],
  changelog = [],
  legacyVersions = null,
  footerText,
}: AboutModalProps) {
  const { shouldRender, isExiting } = useAnimatedVisibility(isOpen, 200);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        padding: "20px",
        animation: isExiting
          ? "modalBackdropOut 0.2s ease forwards"
          : "modalBackdropIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-primary)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: `${maxWidth}px`,
          maxHeight: "85vh",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: isExiting
            ? "modalScaleOut 0.2s ease forwards"
            : "modalScaleIn 0.25s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: "24px 24px 0", textAlign: "center", flexShrink: 0 }}>
          {/* Logo */}
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "18px",
              background: "linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              overflow: "hidden",
              padding: "10px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/ui/brasao-256x256.png"
              alt="Brasão"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          <h3
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "18px",
              fontWeight: "700",
              color: "var(--text-primary)",
              marginBottom: "2px",
            }}
          >
            Acervo Digital
          </h3>

          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "var(--text-muted)",
              marginBottom: "16px",
            }}
          >
            {subtitle}
          </p>

          {/* Info cards */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              textAlign: "left",
            }}
          >
            {infoCards.map((card, index) => (
              <div key={index}>
                <p
                  style={{
                    fontSize: "10px",
                    color: "var(--text-muted)",
                    marginBottom: "2px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {card.label}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: card.isHighlighted ? "600" : "500",
                    color: card.isHighlighted ? "var(--primary)" : "var(--text-primary)",
                  }}
                >
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Changelog scrollavel */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 24px",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "12px",
            }}
          >
            Historico de Atualizacoes
          </p>

          {changelog.map((version, vIndex) => (
            <div key={vIndex} style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    background: version.isCurrent ? "var(--primary)" : "var(--bg-card)",
                    color: version.isCurrent ? "#fff" : "var(--text-primary)",
                    fontSize: "11px",
                    fontWeight: version.isCurrent ? "700" : "600",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    border: version.isCurrent ? "none" : "1px solid var(--border)",
                  }}
                >
                  {version.version}
                </span>
                {version.isCurrent && (
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Atual</span>
                )}
              </div>
              <ul
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  paddingLeft: "16px",
                  margin: 0,
                }}
              >
                {version.items.map((item, iIndex) => (
                  <li
                    key={iIndex}
                    style={{
                      marginBottom: iIndex < version.items.length - 1 ? "4px" : 0,
                    }}
                  >
                    {item.bold && <strong>{item.bold}</strong>} {item.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Versoes antigas colapsadas */}
          {legacyVersions && Object.keys(legacyVersions).length > 0 && (
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: "10px",
                padding: "12px",
                marginBottom: "8px",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                }}
              >
                Versoes anteriores
              </p>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  lineHeight: "1.6",
                }}
              >
                {Object.entries(legacyVersions).map(([ver, desc], index) => (
                  <span key={ver}>
                    {index > 0 && " \u2022 "}
                    <strong>{ver}</strong> {desc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px 24px", flexShrink: 0 }}>
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              textAlign: "center",
              marginBottom: "12px",
            }}
          >
            {footerText}
          </p>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "12px",
              background: "var(--primary)",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;

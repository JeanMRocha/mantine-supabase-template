/**
 * 🌿 loggerLocal - Fallback de logs offline do PerfilSolo
 * Agora 100% compatível com React (navegador)
 * Gera um arquivo .md e força download automático para o usuário
 */

export interface LogDetalhado {
  tipo: 'error' | 'warning' | 'info';
  mensagem: string;
  origem?: string;
  arquivo?: string;
  stack?: string;
  detalhes?: Record<string, any>;
}

/** Simula listagem de estrutura (em client) */
function simularEstruturaBasica(): string {
  return `
📂 src
  ├── components/
  ├── views/
  ├── global-state/
  ├── services/
  ├── router/
  ├── supabase/
  ├── mantine/
  └── main.tsx
`;
}

/** Cria um arquivo de texto e força o download */
function baixarArquivo(nome: string, conteudo: string) {
  const blob = new Blob([conteudo], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}

export async function registrarLogLocal(log: LogDetalhado) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const nomeArquivo = `erro_${timestamp}.md`;

    const estrutura = simularEstruturaBasica();
    const ambiente = {
      navegador: navigator.userAgent,
      plataforma: navigator.platform,
      lingua: navigator.language,
      urlAtual: window.location.href,
    };

    const conteudo = `
# 🚨 Log de Erro - PerfilSolo

**Data/Hora:** ${new Date().toLocaleString()}
**Tipo:** ${log.tipo}
**Mensagem:** ${log.mensagem}
**Origem:** ${log.origem || 'Desconhecida'}
**Arquivo:** ${log.arquivo || 'Não informado'}

---

## 🧩 Stack Trace
\`\`\`
${log.stack || 'Stack não disponível'}
\`\`\`

---

## 🪴 Detalhes
\`\`\`json
${JSON.stringify(log.detalhes || {}, null, 2)}
\`\`\`

---

## 🌐 Ambiente
\`\`\`json
${JSON.stringify(ambiente, null, 2)}
\`\`\`

---

## 🗂️ Estrutura de Projeto (simulada)
\`\`\`
${estrutura}
\`\`\`

---

## 💡 Causa provável
${log.mensagem.includes('Supabase') ? 'Falha de configuração .env ou conexão com o Supabase' : 'Erro de componente ou dependência'}

---

_Log gerado automaticamente no navegador_
`;

    baixarArquivo(nomeArquivo, conteudo);
    console.log(`📘 Log local gerado e baixado: ${nomeArquivo}`);
  } catch (err) {
    console.error('❌ Falha ao gerar log local:', err);
  }
}

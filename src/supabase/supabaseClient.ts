import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase';

/**
 * 🌱 PerfilSolo – Supabase Client
 * Carrega variáveis do .env, cria cliente Supabase e
 * gera logs automáticos locais caso falhe.
 */

const debug = (msg: string, data?: any) => {
  console.log(`[SupabaseClient] ${msg}`, data ?? '');
};

// 🔍 Diagnóstico inicial de ambiente
debug('📦 Verificando variáveis de ambiente (import.meta.env)');
debug('  VITE_SUPABASE_URL =', import.meta.env.VITE_SUPABASE_URL);
debug(
  '  VITE_SUPABASE_ANON_KEY =',
  import.meta.env.VITE_SUPABASE_ANON_KEY ? 'OK' : 'NÃO LIDA',
);

let supabaseClient: ReturnType<typeof createClient> | null = null;

try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // 🧩 Verificação robusta com mensagens claras
  if (!supabaseUrl || !supabaseKey) {
    const msg = '❌ Supabase URL ou KEY não configuradas no .env';
    debug(msg);

    // tenta registrar log local antes de lançar erro
    import('@services/loggerLocal').then(({ registrarLogLocal }) => {
      registrarLogLocal({
        tipo: 'error',
        mensagem: msg,
        origem: 'supabaseClient.ts',
        stack: 'Variáveis .env não detectadas',
        detalhes: {
          arquivo: 'supabaseClient.ts',
          envDetectado: {
            VITE_SUPABASE_URL: !!supabaseUrl,
            VITE_SUPABASE_ANON_KEY: !!supabaseKey,
          },
        },
      });
    });

    // lança erro tratado, que será capturado pelo ErrorBoundary
    throw new Error(msg);
  }

  // ✅ Cria client Supabase real
  supabaseClient = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  debug('✅ SupabaseClient criado com sucesso', { url: supabaseUrl });
} catch (err: any) {
  debug('🔥 Erro ao inicializar SupabaseClient', err);

  // 🔸 Garante registro local mesmo em falha crítica
  import('@services/loggerLocal').then(({ registrarLogLocal }) => {
    registrarLogLocal({
      tipo: 'critical',
      mensagem: err.message,
      origem: 'supabaseClient.ts',
      stack: err.stack,
      detalhes: {
        arquivo: 'supabaseClient.ts',
        contexto: 'Falha na inicialização do SupabaseClient',
        envDetectado: {
          VITE_SUPABASE_URL: !!import.meta.env.VITE_SUPABASE_URL,
          VITE_SUPABASE_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      },
    });
  });

  // 🔧 Client mock para evitar travamento da aplicação
  supabaseClient = {
    auth: {
      signInWithPassword: async () => {
        throw new Error('Supabase indisponível (modo mock).');
      },
    },
    from: () => ({
      select: async () => ({
        data: [],
        error: new Error('Supabase indisponível (modo mock).'),
      }),
    }),
  } as any;
}

export { supabaseClient };

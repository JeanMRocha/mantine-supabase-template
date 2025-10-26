import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase';

const debug = (msg: string, data?: any) => {
  console.log(`[SupabaseClient] ${msg}`, data ?? '');
};

// Debug do ambiente (visível no console do navegador)
debug('📦 Verificando variáveis (import.meta.env)');
debug('  VITE_SUPABASE_URL =', import.meta.env.VITE_SUPABASE_URL);
debug(
  '  VITE_SUPABASE_ANON_KEY =',
  import.meta.env.VITE_SUPABASE_ANON_KEY ? 'OK' : 'NÃO LIDA',
);

let supabaseClient: ReturnType<typeof createClient> | null = null;

try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const msg = '❌ Supabase URL ou KEY não configuradas no .env';
    debug(msg);

    import('@services/loggerLocal').then(({ registrarLogLocal }) => {
      registrarLogLocal({
        tipo: 'error',
        mensagem: msg,
        origem: 'supabaseClient.ts',
        stack: 'Variáveis .env não detectadas em import.meta.env',
        detalhes: {
          arquivo: 'supabaseClient.ts',
          envDetectado: {
            VITE_SUPABASE_URL: !!supabaseUrl,
            VITE_SUPABASE_ANON_KEY: !!supabaseKey,
          },
        },
      });
    });

    throw new Error(msg);
  }

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

  // Modo mock para não quebrar o app
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

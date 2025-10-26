import { supabaseClient } from '@supabase/supabaseClient';

/**
 * 🌿 loggerService
 * Serviço central de logs do PerfilSolo.
 * Registra erros, avisos e eventos importantes da aplicação.
 */

export interface LogEvento {
  tipo: 'error' | 'warning' | 'info';
  mensagem: string;
  origem?: string;
  usuario_id?: string | null;
  detalhes?: Record<string, any>;
}

export async function registrarLog(evento: LogEvento) {
  const data = {
    tipo: evento.tipo,
    mensagem: evento.mensagem,
    origem: evento.origem || window.location.pathname,
    usuario_id: evento.usuario_id || null,
    detalhes: evento.detalhes || {},
    timestamp: new Date().toISOString(),
  };

  try {
    // Log local para debug
    console.groupCollapsed(`📜 [LOG ${evento.tipo.toUpperCase()}]`);
    console.table(data);
    console.groupEnd();

    // Envio ao Supabase (tabela logs_sistema)
    const { error } = await supabaseClient.from('logs_sistema').insert([data]);

    if (error) {
      console.warn('⚠️ Falha ao enviar log para o Supabase:', error.message);
    }
  } catch (err) {
    console.error('❌ Erro interno no loggerService:', err);
  }
}

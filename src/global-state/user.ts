import { User } from '@supabase/supabase-js';
import { atom } from 'nanostores';
import { supabaseClient } from '../supabase/supabaseClient';
import { notifications } from '@mantine/notifications';

// 🧠 inicia como "undefined" para diferenciar de null (sem usuário)
export const $currUser = atom<User | null | undefined>(undefined);

// 🔹 restaura sessão imediatamente ao carregar a aplicação
(async () => {
  const { data, error } = await supabaseClient.auth.getSession();

  if (!error) {
    $currUser.set(data.session?.user ?? null);
  }

  // opcional: log visual
  notifications.show({
    title: 'Sessão restaurada',
    message: data.session
      ? `Usuário ativo: ${data.session.user.email}`
      : 'Nenhum usuário ativo',
    color: data.session ? 'green' : 'gray',
  });
})();

// 🔹 escuta mudanças de autenticação em tempo real
supabaseClient.auth.onAuthStateChange((event, session) => {
  $currUser.set(session?.user ?? null);

  notifications.show({
    title: 'Autenticação atualizada',
    message: `Evento: ${event}`,
    color: 'blue',
  });
});

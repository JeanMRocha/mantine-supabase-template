import type { User } from '@supabase/supabase-js';
import { atom, onMount } from 'nanostores';
import { notifications } from '@mantine/notifications';

// ⚠️ Import RELATIVO para eliminar dúvida de alias neste momento
import { supabaseClient } from '@sb/supabaseClient';

/**
 * Estado global do usuário
 * - undefined: ainda determinando
 * - null: sem sessão
 * - User: logado
 */
export const $currUser = atom<User | null | undefined>(undefined);

/**
 * Inicializa assim que houver pelo menos um subscriber do store.
 * - Restaura sessão
 * - Assina eventos de auth
 * - Faz cleanup no unmount
 */
onMount($currUser, () => {
  let unsubscribe: (() => void) | undefined;

  (async () => {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      console.warn('[auth] getSession error:', error.message);
      $currUser.set(null);
    } else {
      $currUser.set(data.session?.user ?? null);
    }

    // Log visual opcional
    notifications.show({
      title: 'Sessão',
      message: data?.session
        ? `Usuário: ${data.session.user.email}`
        : 'Nenhum usuário ativo',
      color: data?.session ? 'green' : 'gray',
    });

    // Escuta mudanças de autenticação
    const { data: sub } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        console.log('[auth] onAuthStateChange:', event);
        $currUser.set(session?.user ?? null);
      },
    );

    // Unsubscribe no dispose do store
    unsubscribe = () => sub.subscription.unsubscribe();
  })();

  return () => {
    unsubscribe?.();
  };
});

/** Helper opcional para signout centralizado */
export async function signOut() {
  await supabaseClient.auth.signOut();
}

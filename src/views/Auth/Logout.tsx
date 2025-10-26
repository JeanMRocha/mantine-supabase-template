// src/views/Auth/Logout.tsx
import { useEffect } from 'react';
import { supabaseClient } from '@sb/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { $currUser } from '@global/user';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await supabaseClient.auth.signOut();
        $currUser.set(null);
        notifications.show({
          title: 'Sessão encerrada',
          message: 'Faça login novamente.',
          color: 'green',
        });
      } catch (e: any) {
        notifications.show({
          title: 'Erro ao sair',
          message: e?.message || 'Tente novamente.',
          color: 'red',
        });
      } finally {
        navigate('/auth', { replace: true });
      }
    })();
  }, [navigate]);

  return null;
}

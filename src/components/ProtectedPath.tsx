import { useStore } from '@nanostores/react';
import { User } from '@supabase/supabase-js';
import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { $currUser } from '../global-state/user';

interface ProtectedPathProps extends PropsWithChildren {
  redirectUrl: string;
  shouldRedirect?: (arg0: User | null | undefined) => boolean;
}

export const ProtectedPath = ({
  children,
  redirectUrl,
  shouldRedirect,
}: ProtectedPathProps) => {
  const user = useStore($currUser);

  // 🧠 evita redirecionar antes de carregar o estado real da sessão
  if (user === undefined) {
    return null; // opcional: colocar spinner ou <div>Carregando...</div>
  }

  // 🔒 se não há usuário logado, redireciona
  if (shouldRedirect ? shouldRedirect(user) : user == null) {
    return <Navigate to={redirectUrl} />;
  }

  // ✅ usuário autenticado, renderiza normalmente
  return <>{children}</>;
};

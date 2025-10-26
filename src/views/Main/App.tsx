// src/views/Main/App.tsx
import { Navigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { $currUser } from '@global/user';
import { LoaderInline } from '@components/loaders';

/**
 * 🌱 App (index route)
 * - Enquanto restaura a sessão: mostra um loader.
 * - Se logado: manda para /dashboard.
 * - Se não logado: ProtectedPath já redireciona para /auth.
 */
export default function App() {
  const user = useStore($currUser);

  // user === undefined => ainda restaurando sessão
  if (user === undefined) {
    return <LoaderInline message="Restaurando sessão..." />;
  }

  // Autenticado: seguir para o dashboard
  return <Navigate to="/dashboard" replace />;
}

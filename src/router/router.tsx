import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedPath } from '@components/ProtectedPath';

// 🌿 Lazy loading dos módulos
const AppLayout = lazy(() => import('@views/Main/AppLayout'));
const App = lazy(() => import('@views/Main/App'));
const Dashboard = lazy(() => import('@views/Main/Dashboard'));
const Authentication = lazy(() => import('@views/Auth/Auth'));
const UserProfile = lazy(() => import('@views/User/Profile'));
const Settings = lazy(() => import('@views/Config/Settings'));
const DashboardAnaliseSolo = lazy(
  () => import('@views/AnaliseSolo/DashboardAnaliseSolo'),
);
const CadastroAnaliseSolo = lazy(
  () => import('@views/AnaliseSolo/CadastroAnaliseSolo'),
);

/**
 * 🌱 Router principal do PerfilSolo
 * Estrutura modular + lazy loading + segurança única (ProtectedPath)
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Carregando layout...</div>}>
        <ProtectedPath redirectUrl="/auth">
          <AppLayout />
        </ProtectedPath>
      </Suspense>
    ),
    children: [
      // Página inicial
      {
        index: true,
        element: (
          <Suspense fallback={<div>Carregando aplicação...</div>}>
            <App />
          </Suspense>
        ),
      },

      // Dashboard principal
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<div>Carregando dashboard...</div>}>
            <Dashboard />
          </Suspense>
        ),
      },

      // Usuário e configurações
      {
        path: 'user',
        element: (
          <Suspense fallback={<div>Carregando perfil...</div>}>
            <UserProfile />
          </Suspense>
        ),
      },
      {
        path: 'config',
        element: (
          <Suspense fallback={<div>Carregando configurações...</div>}>
            <Settings />
          </Suspense>
        ),
      },

      // 🌾 Módulo de Análise de Solo
      {
        path: 'analise-solo',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Carregando análises...</div>}>
                <DashboardAnaliseSolo />
              </Suspense>
            ),
          },
          {
            path: 'cadastro',
            element: (
              <Suspense fallback={<div>Carregando cadastro...</div>}>
                <CadastroAnaliseSolo />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  /* 🔐 Autenticação pública */
  {
    path: '/auth',
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoaderGlobal message="Carregando login..." />}>
            <Authentication />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense
            fallback={<LoaderGlobal message="Carregando registro..." />}
          >
            <Register />
          </Suspense>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <Suspense
            fallback={<LoaderGlobal message="Carregando recuperação..." />}
          >
            <ForgotPassword />
          </Suspense>
        ),
      },
    ],
  },
]);

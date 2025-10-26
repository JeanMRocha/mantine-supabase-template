import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

// 🔹 Carrega .env manualmente
dotenv.config();

console.log('🧩 Ambiente carregado via dotenv:');
console.log('  VITE_SUPABASE_URL =', process.env.VITE_SUPABASE_URL);
console.log(
  '  VITE_SUPABASE_ANON_KEY =',
  process.env.VITE_SUPABASE_ANON_KEY ? 'OK' : 'FALTA',
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@global': path.resolve(__dirname, 'src/global-state'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@supabase': path.resolve(__dirname, 'src/supabase'),
      '@supabase/supabase-js': path.resolve(
        __dirname,
        'node_modules/@supabase/supabase-js/dist/module/index.js',
      ),
    },
  },

  // 🔧 Injeta variáveis .env no frontend
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
      process.env.VITE_SUPABASE_URL,
    ),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
      process.env.VITE_SUPABASE_ANON_KEY,
    ),
  },
});

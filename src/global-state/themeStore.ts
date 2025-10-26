import { atom } from 'nanostores';

/**
 * 🌗 Armazena o tema atual e persiste no localStorage.
 */
const saved =
  (localStorage.getItem('perfilsolo_tema') as 'light' | 'dark') || 'light';

export const $tema = atom<'light' | 'dark'>(saved);

export function alternarTema() {
  const novo = $tema.get() === 'light' ? 'dark' : 'light';
  $tema.set(novo);
  localStorage.setItem('perfilsolo_tema', novo);
}

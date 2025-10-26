import { atom } from 'nanostores';

/**
 * 🔄 Estado global de carregamento.
 * true  → mostra LoaderGlobal (tela inteira)
 * false → oculta
 */
export const $loading = atom(false);

export function setLoading(state: boolean) {
  $loading.set(state);
}

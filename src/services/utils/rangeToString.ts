// src/services/utils/rangeToString.ts
import type { Range } from '../../types/soil';

export const rangeToString = (r?: Range) => (r ? `${r[0]}–${r[1]}` : '—');

// src/views/AnaliseSolo/hooks/useIdealRange.ts
import { useEffect, useState } from 'react';
import {
  ContextoSolo,
  IdealRange,
  SoilParam,
  getIdealRange,
} from '@services/soilStandardsService';

export function useIdealRange(parametro: SoilParam, ctx: ContextoSolo) {
  const [range, setRange] = useState<IdealRange>({
    min: 5.5,
    max: 6.5,
    unidade: 'pH',
  });
  const [source, setSource] = useState<'supabase' | 'mock'>('mock');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const res = await getIdealRange(parametro, ctx);
      if (!alive) return;
      setRange({ min: res.min, max: res.max, unidade: res.unidade });
      setSource(res.source);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [parametro, JSON.stringify(ctx)]);

  return { range, source, loading };
}

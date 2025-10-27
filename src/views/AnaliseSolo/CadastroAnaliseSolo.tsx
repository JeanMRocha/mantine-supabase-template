import {
  Card,
  Group,
  Title,
  Switch,
  Stack,
  SimpleGrid,
  Divider,
  Select,
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { supabaseClient } from '../../supabase/supabaseClient';
import { analisesMock, AnaliseSolo } from '../../data/analisesMock';
import PhCard from './PhCard';
import NutrientCard from './NutrientCard';
import {
  getSoilParams,
  summarizeRanges,
} from '../../services/soilParamsService';
import type { RangeMap } from '../../types/soil';

const DEFAULT_UNITS: Record<string, string> = {
  N: 'mg/dm³',
  P: 'mg/dm³',
  K: 'cmolc/dm³', // ajuste se seu laudo vier em mg/dm³
  Ca: 'cmolc/dm³',
  Mg: 'cmolc/dm³',
  MO: '%',
};

export default function CadastroAnaliseSolo() {
  const [analises, setAnalises] = useState<AnaliseSolo[]>(analisesMock);
  const [analise, setAnalise] = useState<AnaliseSolo>(analisesMock[0]);

  const [values, setValues] = useState<Record<string, number>>(
    analisesMock[0].nutrientes,
  );

  // faixas ideais dinâmicas (Supabase → mock)
  const [idealRanges, setIdealRanges] = useState<RangeMap>(
    analisesMock[0].faixaIdeal,
  );

  // toggles — agora com N
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    pH: true,
    N: true,
    P: true,
    K: true,
    // pode ligar outros depois:
    // Ca: false, Mg: false, MO: false,
  });

  const culturas = useMemo(
    () => [...new Set(analises.map((a) => a.cultura))].map((c) => c ?? '—'),
    [analises],
  );
  const variedades = useMemo(
    () =>
      analises
        .filter((a) => a.cultura === analise.cultura)
        .map((a) => a.variedade || 'Padrão'),
    [analises, analise.cultura],
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabaseClient.from('analises_solo').select('*');
        if (data && data.length) {
          const adaptado = data.map((d: any, i: number) => ({
            id: d.id || i,
            cultura: d.cultura,
            variedade: d.variedade,
            estado: d.estado,
            cidade: d.cidade,
            estagio: d.estagio,
            idade: d.idade,
            nutrientes: d.nutrientes,
            faixaIdeal: d.faixa_ideal,
            observacoes: d.observacoes,
          })) as AnaliseSolo[];

          setAnalises(adaptado);
          setAnalise(adaptado[0]);
          setValues(adaptado[0].nutrientes);
          setIdealRanges(adaptado[0].faixaIdeal);

          notifications.show({
            title: 'Dados carregados',
            message: 'Análises reais carregadas do Supabase.',
            color: 'green',
          });
        }
      } catch {
        /* segue mock */
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const q = {
        cultura: analise.cultura,
        variedade: analise.variedade,
        estado: analise.estado,
        cidade: analise.cidade,
        extrator: 'mehlich-1',
        estagio: analise.estagio ?? 'produção',
      };
      const params = await getSoilParams(q);
      if (params?.ideal) {
        setIdealRanges(params.ideal);
        notifications.show({
          title: 'Faixas ideais aplicadas',
          message: summarizeRanges(params.ideal),
          color: 'teal',
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analise.cultura, analise.variedade, analise.estado, analise.cidade]);

  const toggle = (k: string, v: boolean) =>
    setEnabled((p) => ({ ...p, [k]: v }));
  const setVal = (k: string, v: number) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  return (
    <Stack>
      <Card withBorder radius="md" p="md">
        <Group justify="space-between" align="end">
          <Title order={4} c="green.7">
            Parâmetros da cultura
          </Title>
          <Group gap="md" wrap="wrap">
            <Select
              label="Cultura"
              value={analise.cultura}
              placeholder="Selecione"
              data={culturas}
              onChange={(val) =>
                setAnalise((prev) => ({
                  ...prev,
                  cultura: val ?? prev.cultura,
                }))
              }
              w={220}
            />
            <Select
              label="Variedade"
              value={analise.variedade || 'Padrão'}
              placeholder="Selecione"
              data={variedades}
              onChange={(val) =>
                setAnalise((p) => ({
                  ...p,
                  variedade: val === 'Padrão' ? null : val || null,
                }))
              }
              w={220}
            />
          </Group>
        </Group>

        {/* Toggles de exibição */}
        <Group mt="md" gap="md" wrap="wrap">
          {['pH', 'N', 'P', 'K'].map((k) => (
            <Switch
              key={k}
              checked={!!enabled[k]}
              onChange={(e) => toggle(k, e.currentTarget.checked)}
              label={k}
              color="green"
            />
          ))}
        </Group>
      </Card>

      <Divider label="Interpretação" labelPosition="center" />

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        {enabled['pH'] && (
          <PhCard
            value={values['pH'] ?? 7}
            onChange={(v) => setVal('pH', v)}
            ideal={(idealRanges['pH'] as [number, number]) ?? [5.5, 6.5]}
          />
        )}

        {(['N', 'P', 'K'] as const).map((n) => {
          if (!enabled[n]) return null;
          const unit = DEFAULT_UNITS[n] ?? 'mg/dm³';
          const ideal = (idealRanges[n] as [number, number]) ?? [0, 0];
          const scaleMax = Math.max(ideal[1] * 2, ideal[0] * 3, 10); // dá “respiro” visual

          return (
            <NutrientCard
              key={n}
              name={n}
              unit={unit}
              value={values[n] ?? 0}
              onChange={(v) => setVal(n, v)}
              ideal={ideal}
              scale={[0, scaleMax]}
              info={{
                low: `${n} abaixo — considerar adubação corretiva.`,
                ideal: `${n} adequado — manter manejo.`,
                high: `${n} alto — risco de desequilíbrio/antagonismo.`,
              }}
            />
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}

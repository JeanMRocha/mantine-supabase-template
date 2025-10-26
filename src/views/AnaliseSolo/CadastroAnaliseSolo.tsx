import {
  Card,
  Group,
  Title,
  Switch,
  Stack,
  SimpleGrid,
  Divider,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { supabaseClient } from '../../supabase/supabaseClient';
import { analisesMock, AnaliseSolo } from '../../data/analisesMock';
import PhCard from './PhCard';
import NutrientCard from './NutrientCard';

const DEFAULT_UNITS: Record<string, string> = {
  P: 'mg/dm³',
  K: 'mg/dm³',
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

  // quais cards mostrar
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    pH: true,
    P: true,
    K: true,
    Ca: true,
    Mg: true,
    MO: true,
  });

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
          notifications.show({
            title: 'Dados carregados',
            message: 'Análises reais carregadas do Supabase.',
            color: 'green',
          });
        }
      } catch {
        // segue com mock
      }
    })();
  }, []);

  const faixa = analise.faixaIdeal;

  const toggle = (k: string, v: boolean) =>
    setEnabled((p) => ({ ...p, [k]: v }));
  const setVal = (k: string, v: number) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  return (
    <Stack>
      {/* Paleta de nutrientes (toggle) */}
      <Card withBorder radius="md" p="md">
        <Group justify="space-between">
          <Title order={4} c="green.7">
            Selecionar parâmetros
          </Title>
        </Group>
        <Group mt="xs" gap="md" wrap="wrap">
          {['pH', 'P', 'K', 'Ca', 'Mg', 'MO'].map((k) => (
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

      {/* Grade de cards */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        {enabled['pH'] && (
          <PhCard
            value={values['pH'] ?? 7}
            onChange={(v) => setVal('pH', v)}
            ideal={(faixa['pH'] as [number, number]) ?? [5.5, 6.5]}
          />
        )}

        {(['P', 'K', 'Ca', 'Mg', 'MO'] as const).map((n) => {
          if (!enabled[n]) return null;
          const unit = DEFAULT_UNITS[n] ?? 'mg/dm³';
          const ideal = (faixa[n] as [number, number]) ?? [0, 0];

          return (
            <NutrientCard
              key={n}
              name={n}
              unit={unit}
              value={values[n] ?? 0}
              onChange={(v) => setVal(n, v)}
              ideal={ideal}
              // Escala total = 0 .. 2x do idealMax, para dar “respiro”
              scale={[0, Math.max(ideal[1] * 2, 1)]}
              // paleta cinza; podemos substituir por gradiente próprio depois
              palette={(i, tot) =>
                i / tot < 0.5
                  ? 'var(--mantine-color-dark-5)'
                  : 'var(--mantine-color-dark-4)'
              }
              info={{
                low: `${n} abaixo do ideal — considerar correção.`,
                high: `${n} elevado — risco de antagonismo.`,
                ideal: `${n} em faixa adequada.`,
              }}
            />
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}

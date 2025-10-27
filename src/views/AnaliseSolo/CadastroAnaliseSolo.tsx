import {
  Card,
  Group,
  Title,
  Switch,
  Stack,
  SimpleGrid,
  Divider,
  Select,
  Text,
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

// Unidades de medida para cada nutriente, baseadas no laudo.
const DEFAULT_UNITS: Record<string, string> = {
  P: 'mg/dm³',
  K: 'mg/dm³',
  Ca: 'cmolc/dm³',
  Mg: 'cmolc/dm³',
  Al: 'cmolc/dm³',
  'M.O.': '%',
  'V%': '%',
};

export default function CadastroAnaliseSolo() {
  const [analises, setAnalises] = useState<AnaliseSolo[]>(analisesMock);
  const [analise, setAnalise] = useState<AnaliseSolo>(analisesMock[0]);

  const [values, setValues] = useState<Record<string, number>>(
    analisesMock[0].nutrientes,
  );

  const [idealRanges, setIdealRanges] = useState<RangeMap>(
    analisesMock[0].faixaIdeal,
  );

  // Gera o estado inicial dos toggles a partir da primeira análise
  const initialEnabled = useMemo(() => {
    const nutrients = Object.keys(analisesMock[0].nutrientes);
    return nutrients.reduce((acc, key) => ({ ...acc, [key]: true }), {});
  }, []);

  const [enabled, setEnabled] =
    useState<Record<string, boolean>>(initialEnabled);

  // Opções para os Selects
  const amostrasOptions = useMemo(
    () => analises.map((a) => a.codigo_amostra),
    [analises],
  );

  // --- Efeitos ---

  // Carrega dados do Supabase (se houver)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabaseClient.from('analises_solo').select('*');
        if (data && data.length) {
          // Adapta os dados do Supabase para a nossa interface
          const adaptado = data.map((d: any) => ({
            id: d.id,
            proprietario: d.proprietario,
            cpf: d.cpf,
            data_analise: d.data_analise,
            codigo_amostra: d.codigo_amostra,
            profundidade: d.profundidade,
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
          setEnabled(
            Object.keys(adaptado[0].nutrientes).reduce(
              (acc, key) => ({ ...acc, [key]: true }),
              {},
            ),
          );

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

  // Busca faixas ideais quando a cultura/variedade muda
  useEffect(() => {
    (async () => {
      const q = {
        cultura: analise.cultura,
        variedade: analise.variedade,
        estado: analise.estado,
        cidade: analise.cidade,
        extrator: 'mehlich-1', // Exemplo
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
  }, [
    analise.cultura,
    analise.variedade,
    analise.estado,
    analise.cidade,
    analise.estagio,
  ]);

  // --- Handlers ---

  const handleAmostraChange = (codigo_amostra: string | null) => {
    const novaAnalise = analises.find(
      (a) => a.codigo_amostra === codigo_amostra,
    );
    if (novaAnalise) {
      setAnalise(novaAnalise);
      setValues(novaAnalise.nutrientes);
      setIdealRanges(novaAnalise.faixaIdeal);
      // Reseta os toggles para a nova análise
      setEnabled(
        Object.keys(novaAnalise.nutrientes).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {},
        ),
      );
    }
  };

  const toggle = (k: string, v: boolean) =>
    setEnabled((p) => ({ ...p, [k]: v }));
  const setVal = (k: string, v: number) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const nutrientKeys = useMemo(() => Object.keys(values), [values]);

  return (
    <Stack>
      <Card withBorder radius="md" p="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={4} c="green.7">
              Dados da Análise
            </Title>
            <Text size="sm">
              <b>Proprietário:</b> {analise.proprietario}
            </Text>
            <Text size="sm">
              <b>Amostra:</b> {analise.codigo_amostra} ({analise.profundidade})
            </Text>
            <Text size="sm">
              <b>Cultura:</b> {analise.cultura} ({analise.variedade || 'Padrão'})
            </Text>
          </Stack>
          <Select
            label="Selecionar Amostra"
            value={analise.codigo_amostra}
            placeholder="Selecione"
            data={amostrasOptions}
            onChange={handleAmostraChange}
            w={220}
          />
        </Group>

        <Divider my="md" />

        {/* Toggles de exibição */}
        <Group gap="md" wrap="wrap">
          <Text fw={500} size="sm">
            Exibir nutrientes:
          </Text>
          {nutrientKeys.map((k) => (
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

      <Divider label="Interpretação dos Resultados" labelPosition="center" />

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {enabled['pH'] && (
          <PhCard
            value={values['pH'] ?? 7}
            onChange={(v) => setVal('pH', v)}
            ideal={(idealRanges['pH'] as [number, number]) ?? [5.5, 6.5]}
          />
        )}

        {nutrientKeys.map((n) => {
          if (n === 'pH' || !enabled[n]) return null;
          const unit = DEFAULT_UNITS[n] ?? '';
          const ideal = (idealRanges[n] as [number, number]) ?? [0, 0];
          // Escala dinâmica para melhor visualização
          const max = Math.max(ideal[1] * 2, values[n] * 1.2, 10);

          return (
            <NutrientCard
              key={n}
              name={n}
              unit={unit}
              value={values[n] ?? 0}
              onChange={(v) => setVal(n, v)}
              ideal={ideal}
              min={0}
              max={max}
            />
          );
        })
      </SimpleGrid>
    </Stack>
  );
}

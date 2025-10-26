import {
  Card,
  Group,
  Text,
  Select,
  NumberInput,
  Button,
  Divider,
  SimpleGrid,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { supabaseClient } from '../../supabase/supabaseClient';
import { analisesMock, AnaliseSolo } from '../../data/analisesMock';
import { RecomendacaoCard } from './RecomendacaoCard';
import { GraficoAnalise } from './GraficoAnalise';
import { notifications } from '@mantine/notifications';

/**
 * 🧠 CadastroAnaliseSolo
 * Tela principal de cadastro e visualização da análise de solo.
 * Mostra campos dinâmicos, diagnóstico e gráfico interativo.
 */
export function CadastroAnaliseSolo() {
  const [analises, setAnalises] = useState<AnaliseSolo[]>(analisesMock);
  const [analise, setAnalise] = useState<AnaliseSolo>(analisesMock[0]);
  const [nutrientes, setNutrientes] = useState<Record<string, number>>(
    analisesMock[0].nutrientes,
  );
  const [nutrienteSelecionado, setNutrienteSelecionado] = useState<
    string | null
  >(null);

  /**
   * 🔹 Carrega as análises reais do Supabase se disponível.
   * Caso contrário, mantém os dados mockados (offline-safe).
   */
  useEffect(() => {
    async function carregarDados() {
      try {
        const { data, error } = await supabaseClient
          .from('analises_solo')
          .select('*');

        if (error || !data || data.length === 0) {
          console.warn('Usando dados mockados (sem conexão ao Supabase).');
          return;
        }

        // Converte para o formato usado no app
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
        }));

        setAnalises(adaptado);
        setAnalise(adaptado[0]);
        setNutrientes(adaptado[0].nutrientes);

        notifications.show({
          title: 'Dados carregados',
          message: 'Análises reais carregadas do Supabase.',
          color: 'green',
        });
      } catch (err) {
        console.error(err);
        notifications.show({
          title: 'Falha na conexão',
          message: 'Usando dados de exemplo (modo offline).',
          color: 'orange',
        });
      }
    }

    carregarDados();
  }, []);

  /** 🔸 Atualiza o valor de um nutriente */
  function handleNutrienteChange(chave: string, valor: number) {
    setNutrientes((prev) => ({ ...prev, [chave]: valor }));
  }

  /** 🔸 Atualiza o gráfico e o card de recomendação */
  function atualizarAnalise() {
    notifications.show({
      title: 'Análise atualizada',
      message: 'Os valores foram recalculados com sucesso.',
      color: 'teal',
    });
  }

  return (
    <Card shadow="sm" radius="md" withBorder p="xl">
      <Text fw={600} size="xl" mb="lg" c="green.8">
        Cadastro e Interpretação de Análise de Solo
      </Text>

      {/* SELEÇÃO DE CULTURA */}
      <Group grow mb="md">
        <Select
          label="Cultura"
          placeholder="Selecione"
          value={analise.cultura}
          data={[...new Set(analises.map((a) => a.cultura))]}
          onChange={(val) => {
            const nova = analises.find((a) => a.cultura === val);
            if (nova) {
              setAnalise(nova);
              setNutrientes(nova.nutrientes);
            }
          }}
        />

        <Select
          label="Variedade"
          placeholder="Selecione"
          value={analise.variedade}
          data={analises
            .filter((a) => a.cultura === analise.cultura)
            .map((a) => a.variedade || 'Padrão')}
          onChange={(val) => setAnalise({ ...analise, variedade: val || '' })}
        />
      </Group>

      {/* CAMPOS DE NUTRIENTES */}
      <Group grow>
        {Object.keys(nutrientes).map((chave) => (
          <NumberInput
            key={chave}
            label={chave}
            value={nutrientes[chave]}
            step={0.1}
            precision={2}
            onChange={(val) => handleNutrienteChange(chave, val || 0)}
          />
        ))}
      </Group>

      <Button mt="lg" color="green" onClick={atualizarAnalise}>
        Atualizar Gráfico
      </Button>

      {/* INTERPRETAÇÃO COMPLETA */}
      <Divider my="xl" label="Interpretação completa" labelPosition="center" />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        <RecomendacaoCard
          analise={{ ...analise, nutrientes }}
          selecionado={nutrienteSelecionado}
        />
        <GraficoAnalise
          analise={{ ...analise, nutrientes }}
          onSelectNutriente={(n) => setNutrienteSelecionado(n)}
        />
      </SimpleGrid>

      <Divider my="xl" label="Recomendações gerais" labelPosition="center" />

      <Text size="sm" c="dimmed">
        {analise.observacoes ||
          'Insira valores ou selecione uma cultura para gerar recomendações.'}
      </Text>
    </Card>
  );
}

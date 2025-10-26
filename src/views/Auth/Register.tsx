import { useState } from 'react';
import {
  Card,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { LoaderInline } from '@components/loaders';
import { setLoading } from '@global/loadingStore';

/**
 * 🪴 Register — Tela de criação de conta
 */
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleRegister() {
    try {
      setSubmitting(true);
      setLoading(true);
      // Simulação de cadastro (futuro: integração Supabase)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  }

  return (
    <Card shadow="sm" radius="md" p="xl" maw={400} mx="auto" mt="10%">
      <Stack>
        <Title order={3} c="green.8" ta="center">
          🌿 Criar Conta
        </Title>

        <TextInput
          label="Nome"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <TextInput
          label="E-mail"
          placeholder="usuario@email.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />

        <PasswordInput
          label="Senha"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />

        <Button
          color="green"
          radius="md"
          onClick={handleRegister}
          disabled={submitting}
        >
          Registrar
        </Button>

        {submitting && <LoaderInline message="Criando conta..." />}

        <Text fz="sm" ta="center" mt="sm">
          <a href="/auth">Já tenho uma conta</a>
        </Text>
      </Stack>
    </Card>
  );
}

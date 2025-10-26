import { useState } from 'react';
import { Card, Stack, TextInput, Button, Title, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { LoaderInline } from '@components/loaders';
import { setLoading } from '@global/loadingStore';

/**
 * 🔑 ForgotPassword — Recuperação de senha
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleReset() {
    try {
      setSubmitting(true);
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/auth');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  }

  return (
    <Card shadow="sm" radius="md" p="xl" maw={400} mx="auto" mt="10%">
      <Stack>
        <Title order={3} c="green.8" ta="center">
          🔑 Recuperar Senha
        </Title>

        <TextInput
          label="E-mail"
          placeholder="usuario@email.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />

        <Button
          color="green"
          radius="md"
          onClick={handleReset}
          disabled={submitting}
        >
          Enviar link de recuperação
        </Button>

        {submitting && <LoaderInline message="Enviando instruções..." />}

        <Text fz="sm" ta="center" mt="sm">
          <a href="/auth">Voltar ao login</a>
        </Text>
      </Stack>
    </Card>
  );
}

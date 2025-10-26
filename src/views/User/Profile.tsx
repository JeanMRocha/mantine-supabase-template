import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import {
  Card,
  TextInput,
  Button,
  Group,
  Avatar,
  Text,
  Container,
  Stack,
} from '@mantine/core';
import { getProfile, updateProfile } from '../../services/profileService';
import type { UserProfile as UserProfileT } from '../../services/profileService';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileT | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Container size="xs" mt="xl">
        <PageHeader title="Perfil do Usuário" />
        <Text c="dimmed">Carregando...</Text>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container size="xs" mt="xl">
        <PageHeader title="Perfil do Usuário" />
        <Text c="red.6">Não foi possível carregar o perfil.</Text>
        <Button mt="md" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </Container>
    );
  }

  const handleSave = async () => {
    await updateProfile(profile);
    setEditing(false);
  };

  return (
    <Container size="xs" mt="xl">
      <PageHeader title="Perfil do Usuário" />

      <Stack align="center">
        <Avatar radius="xl" size="xl" src={profile.avatar_url}>
          {profile.name?.charAt(0).toUpperCase()}
        </Avatar>

        <Card shadow="sm" p="lg" radius="md" withBorder w="100%">
          <TextInput
            label="Nome"
            value={profile.name || ''}
            onChange={(e) =>
              setProfile({ ...profile, name: e.currentTarget.value })
            }
            readOnly={!editing}
          />

          <TextInput
            label="Email"
            value={profile.email || ''}
            readOnly
            mt="sm"
          />

          <Group justify="center" mt="lg">
            {editing ? (
              <Button color="green" onClick={handleSave}>
                Salvar
              </Button>
            ) : (
              <Button color="blue" onClick={() => setEditing(true)}>
                Editar
              </Button>
            )}
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}

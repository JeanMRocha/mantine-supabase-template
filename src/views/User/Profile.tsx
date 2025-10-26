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
import {
  getProfile,
  updateProfile,
  UserProfile,
} from '../../services/profileService';

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getProfile();
      setProfile(data);
    })();
  }, []);

  if (!profile) return <Text>Carregando...</Text>;

  const handleSave = async () => {
    await updateProfile(profile);
    setEditing(false);
  };

  return (
    <Container size="xs" mt="xl">
      {/* ✅ Cabeçalho padronizado */}
      <PageHeader title="Perfil do Usuário" />

      <Stack align="center">
        <Avatar radius="xl" size="xl" src={profile.avatar_url}>
          {profile.name?.charAt(0).toUpperCase()}
        </Avatar>

        <Card shadow="sm" p="lg" radius="md" withBorder w="100%">
          <TextInput
            label="Nome"
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.currentTarget.value })
            }
            readOnly={!editing}
          />
          <TextInput label="Email" value={profile.email} readOnly mt="sm" />

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

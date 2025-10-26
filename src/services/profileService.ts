// src/services/profileService.ts
import profileData from '../data/profile.json';

// Estrutura compatível com o que o Supabase retornaria
export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar_url?: string;
}

// 🔹 Mock local: leitura do perfil
export async function getProfile(): Promise<UserProfile> {
  // no futuro, substituir por chamada Supabase:
  // const { data } = await supabase.from('usuarios').select('*').eq('id', user.id).single();
  return Promise.resolve({
    name: profileData.name,
    email: profileData.email ?? 'sem-email@perfilsolo.com.br',
    avatar_url: profileData.avatar_url ?? '',
  });
}

// 🔹 Mock local: atualização do perfil
export async function updateProfile(
  updated: Partial<UserProfile>,
): Promise<void> {
  // no futuro, substituir por supabase.from('usuarios').update(updated).eq('id', user.id)
  console.log('🔄 Salvando localmente:', updated);
  return Promise.resolve();
}

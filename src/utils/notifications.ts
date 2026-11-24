import type { UserProfile } from '../context/UserContext';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  to: string;
}

/** Notificações do app — algumas dependem dos dados do perfil (nome, gênero, idade). */
export function buildNotifications(profile: UserProfile, firstName: string): AppNotification[] {
  const list: AppNotification[] = [
    {
      id: 'welcome',
      title: `Olá, ${firstName}!`,
      body: 'Seu perfil está pronto. Toque para revisar ou editar suas informações.',
      to: '/perfil/editar',
    },
  ];

  if (!profile.gender) {
    list.push({
      id: 'gender',
      title: 'Complete seu perfil',
      body: 'Informe seu gênero para personalizar o app para você.',
      to: '/perfil/editar',
    });
  }

  list.push(
    {
      id: 'map',
      title: 'Rede de apoio perto de você',
      body: 'Veja delegacias da mulher, delegacias, hospitais e bombeiros mais próximos na aba Mapa.',
      to: '/mapa',
    },
    {
      id: 'location',
      title: 'Ative sua localização',
      body: 'Usamos a sua localização em caso de risco e para mostrar a rede de apoio mais próxima.',
      to: '/localizacao',
    },
    {
      id: 'guardians',
      title: 'Adicione seus guardiões',
      body: 'Escolha até 3 contatos de confiança para receberem seu aviso em situações de risco.',
      to: '/seguranca',
    }
  );

  return list;
}

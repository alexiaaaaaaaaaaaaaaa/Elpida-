import { createContext, useContext } from 'react';

export type PanelName = 'search' | 'notifications' | 'menu';

interface ChromeValue {
  openPanel: (panel: PanelName) => void;
  unreadCount: number;
}

/** Permite que qualquer cabeçalho abra a busca, as notificações e o menu lateral. */
export const ChromeContext = createContext<ChromeValue>({
  openPanel: () => {},
  unreadCount: 0,
});

export const useChrome = () => useContext(ChromeContext);

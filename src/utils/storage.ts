import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/** useState que lê e grava automaticamente no localStorage. */
export function usePersistedState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage indisponível ou cheio — segue sem persistir
    }
  }, [key, value]);

  return [value, setValue];
}

/** Id único que funciona também em HTTP (crypto.randomUUID exige HTTPS/localhost). */
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Remove acentos e põe em minúsculas — usado na busca. */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

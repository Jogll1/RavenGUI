// Adapted from https://dev.to/lalitkhu/implement-keyboard-shortcuts-in-your-react-app-475c

import React, { createContext, useCallback, useEffect, useRef } from 'react';
import { Modifier, Shortcut, ShortcutHandler, ShortcutRegistry, ShortcutsContextType } from '../lib/shortcuts';

export const ShortcutsContext = createContext<ShortcutsContextType>({
  register: () => {},
  unregister: () => {},
});

const normalizeShortcut = (shortcut: Shortcut): string => {
  const mods = shortcut.modifiers?.slice().sort() || [];
  const key = shortcut.key.toUpperCase();
  return [...mods, key].join('+');
};

const ShortcutProvider = ({ children }: { children: React.ReactNode }) => {
  const ShortcutRegistryRef = useRef<ShortcutRegistry>(new Map());

  const register = (shortcut: Shortcut, handler: ShortcutHandler, override = false) => {
    const ShortcutRegistry = ShortcutRegistryRef.current;
    const normalizedKey = normalizeShortcut(shortcut);

    if (ShortcutRegistry.has(normalizedKey) && !override) {
      console.warn(
        `Conflict: "${normalizedKey}" is already registered for shortcut. Use override=true to replace or handle conflict.`,
      );
      return;
    }

    ShortcutRegistry.set(normalizedKey, handler);
  };

  const unregister = (shortcut: Shortcut) => {
    const normalizedKey = normalizeShortcut(shortcut);
    ShortcutRegistryRef.current.delete(normalizedKey);
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;

    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const modifiers: Modifier[] = [];

    if (event.ctrlKey) modifiers.push('Ctrl');
    if (event.altKey) modifiers.push('Alt');
    if (event.shiftKey) modifiers.push('Shift');
    if (event.metaKey) modifiers.push('Meta');

    const key = event.key.toUpperCase();
    const normalizedKey = [...modifiers.sort(), key].join('+');

    const handler = ShortcutRegistryRef.current.get(normalizedKey);

    if (handler) {
      event.preventDefault();
      handler(event);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return <ShortcutsContext.Provider value={{ register, unregister }}>{children}</ShortcutsContext.Provider>;
};

export default ShortcutProvider;

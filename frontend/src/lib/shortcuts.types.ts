export type Modifier = string;
export type Key = string;

export interface Shortcut {
  key: Key;
  modifiers?: string[];
}

export type ShortcutHandler = (e: KeyboardEvent) => void;
export interface ShortcutsContextType {
  register: (shortcut: Shortcut, handler: ShortcutHandler) => void;
  unregister: (shortcut: Shortcut) => void;
}

export type ShortcutRegistry = Map<string, ShortcutHandler>;

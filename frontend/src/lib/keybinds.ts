import { Shortcut } from './shortcuts.types';

const KEYBINDS = {
  newNode: { key: 'a', modifiers: ['Ctrl'] } as Shortcut,
  deleteNode: { key: 'delete' } as Shortcut,
  resetTargetAspect: { key: 'r', modifiers: ['Ctrl'] } as Shortcut,
};

export default KEYBINDS;

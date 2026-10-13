import { useContext } from 'react';
import { ShortcutsContext } from '../../components/ShortcutsProvider';

const useShortcuts = () => {
  const shortcutContext = useContext(ShortcutsContext);

  if (!shortcutContext) {
    console.error('Shortcut context must be wrapped inside Shortcut provider');
  }

  return shortcutContext;
};

export default useShortcuts;

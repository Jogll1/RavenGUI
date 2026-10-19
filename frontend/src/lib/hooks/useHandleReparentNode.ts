import { useCallback } from 'react';
import type { EditorNodeRecord, ID, ValueSetter } from '../editor/editor.types';
import { canParent } from '../editor/node-utils';

export default function useHandleReparentNode(nodeRecord: ValueSetter<EditorNodeRecord>) {
  const handleReparentNode = useCallback(
    (id: ID, newParent: ID) => {
      if (!canParent(nodeRecord.value, id, newParent)) {
        return;
      }

      nodeRecord.setter((prev) => {
        const updated = Object.entries(prev).map(([key, node]) => {
          const filteredChildren = node.children.filter((child) => child !== id);

          return [key, { ...node, children: key === newParent ? [...filteredChildren, id] : [...filteredChildren] }];
        });

        return Object.fromEntries(updated) as EditorNodeRecord;
      });
    },
    [nodeRecord],
  );

  return { handleReparentNode };
}

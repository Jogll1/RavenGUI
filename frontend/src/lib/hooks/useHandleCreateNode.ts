import { useCallback } from 'react';
import { Setter } from '../types';
import type { EditorNodeRecord, EditorNodeStyles, ID } from '../editor/editor.types';
import { createBaseNode } from '../editor/node-utils';

export default function useHandleCreateNode(setNodes: Setter<EditorNodeRecord>) {
  const handleCreateNode = useCallback(
    (id?: ID, name?: string, parentID?: ID, styles?: EditorNodeStyles) => {
      const { node, validParentID } = createBaseNode(id, name, parentID, styles);

      setNodes((prev) => {
        const nextRecord = { ...prev };

        nextRecord[node.id] = node;

        if (nextRecord[validParentID]) {
          nextRecord[validParentID] = {
            ...nextRecord[validParentID],
            children: [...(nextRecord[validParentID].children ?? []), node.id],
          };
        }

        return nextRecord;
      });

      return node.id;
    },
    [setNodes],
  );

  return { handleCreateNode };
}

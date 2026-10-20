import { useCallback } from 'react';
import { Setter } from '../types';
import { EditorNodeRecord, ID } from '../editor/editor.types';
import { createBaseNode } from '../editor/node-utils';

export default function useHandleCreateNode(setNodes: Setter<EditorNodeRecord>) {
  const handleCreateNode = useCallback(
    (id?: ID, name?: string, parentID?: ID) => {
      const { node, validParentID } = createBaseNode(id, name, parentID);

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

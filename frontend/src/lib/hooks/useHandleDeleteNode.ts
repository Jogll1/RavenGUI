import { useCallback } from 'react';
import { EditorNodeRecord, ID, ValueSetter } from '../editor/editor.types';
import { isNodeDescendent } from '../editor/node-utils';

export default function useHandleDeleteNode(nodes: ValueSetter<EditorNodeRecord>, selected: ValueSetter<ID | null>) {
  const handleDeleteNode = useCallback(
    (id: ID) => {
      nodes.setter((prev) => {
        const updated = Object.entries(prev)
          // Remove the node's descendants
          .filter(([nodeId, _node]) => !isNodeDescendent(nodes.value, id, nodeId as ID))
          // Remove the node
          .filter(([nodeId, _node]) => nodeId !== id)
          // Remove the node's id its parent's children list
          .map(([key, node]) => {
            return [
              key,
              node.children.includes(id)
                ? {
                    ...node,
                    children: node.children.filter((childId) => childId !== id),
                  }
                : node,
            ];
          });

        return Object.fromEntries(updated) as EditorNodeRecord;
      });

      // Remove as selected node if its selected
      if (selected.value && selected.value === id) selected.setter(null);
    },
    [nodes, selected],
  );

  return { handleDeleteNode };
}

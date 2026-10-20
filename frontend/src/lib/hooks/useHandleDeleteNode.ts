import { useCallback } from 'react';
import { Setter } from '../types';
import { EditorNodeRecord, ID, ValueSetter } from '../editor/editor.types';
import { isNodeDescendent } from '../editor/node-utils';

// TODO: remove descendants too
export default function useHandleDeleteNode(nodes: ValueSetter<EditorNodeRecord>, setSelected?: Setter<ID | null>) {
  const handleDeleteNode = useCallback(
    (id: ID) => {
      nodes.setter((prev) => {
        const updated = Object.entries(prev)
          // Remove the node's descendants
          .filter(([nodeId, _node]) => !isNodeDescendent(nodes.value, id, nodeId as ID))
          // Remove the node
          .filter(([nodeId, _node]) => nodeId !== id)
          // Remove the node's id from children lists
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

      // Remove as selected node if provided
      if (setSelected) setSelected(null);
    },
    [nodes, setSelected],
  );

  return { handleDeleteNode };
}

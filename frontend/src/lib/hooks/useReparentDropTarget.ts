import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useRef, useState, useEffect } from 'react';
import { ROOT_ID, isEditorNode } from '../editor/editor.shared';
import type { EditorNodeRecord, ID, ValueSetter } from '../editor/editor.types';
import { canParent } from '../editor/node-utils';
import useHandleReparentNode from './useHandleReparentNode';

export default function useReparentDropTarget(nodes: ValueSetter<EditorNodeRecord>, parentId: ID = ROOT_ID) {
  const { handleReparentNode } = useHandleReparentNode(nodes);

  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      onDragEnter: ({ source }) => {
        if (source.data.node && isEditorNode(source.data.node)) {
          setHovered(true);
        }
      },
      canDrop: ({ source }) => {
        return (
          !!source.data.node && isEditorNode(source.data.node) && canParent(nodes.value, source.data.node.id, parentId)
        );
      },
      onDragLeave: () => setHovered(false),
      onDrop: ({ source }) => {
        setHovered(false);
        if (source.data.node && isEditorNode(source.data.node)) {
          handleReparentNode(source.data.node.id, parentId);
        }
      },
    });
  }, [nodes, handleReparentNode, parentId]);

  return { ref, hovered };
}

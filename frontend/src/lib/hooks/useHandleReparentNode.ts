// import { useCallback } from 'react';
// import type { ID, EditorNodeRecord } from '../editor/editor.types';
// import type { Setter } from '../types';

// export function useNodeActions(setNodes: Setter<EditorNodeRecord>) {
//   const handleReparentNode = useCallback(
//     (nodeId: ID, newParentId: ID) => {
//       setNodes((prevRecord) => {
//         const targetNode = prevRecord[nodeId];
//         if (!targetNode) {
//           console.warn(`Node with ID ${nodeId} not found.`);
//           return prevRecord;
//         }

//         const nextRecord = { ...prevRecord };

//         // 3. Find the old parent by scanning the record
//         // (If your EditorNode object stores a parentID property, you can look it up directly instead of searching)
//         const oldParentId = Object.keys(nextRecord).find((key) => nextRecord[key].children.includes(nodeId));

//         // 4. Remove the node ID from the old parent's children array
//         if (oldParentId && nextRecord[oldParentId]) {
//           nextRecord[oldParentId] = {
//             ...nextRecord[oldParentId],
//             children: nextRecord[oldParentId].children.filter((id) => id !== nodeId),
//           };
//         }

//         // 5. Add the node ID to the new parent's children array
//         if (nextRecord[newParentId]) {
//           // Prevent duplicate entries just in case
//           const currentChildren = nextRecord[newParentId].children;
//           if (!currentChildren.includes(nodeId)) {
//             nextRecord[newParentId] = {
//               ...nextRecord[newParentId],
//               children: [...currentChildren, nodeId],
//             };
//           }
//         } else {
//           console.warn(`New parent node with ID ${newParentId} does not exist.`);
//           return prevRecord;
//         }

//         // 6. Optional: Update the node itself if it keeps a record of its parent
//         /*
//       nextRecord[nodeId] = {
//         ...nextRecord[nodeId],
//         parentId: newParentId
//       };
//       */

//         return nextRecord;
//       });
//     },
//     [setNodes],
//   );

//   return { handleReparentNode };
// }

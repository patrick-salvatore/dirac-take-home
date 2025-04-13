import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Node,
  Edge,
  Position,
  OnConnect,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import { ModelComponent } from '../types';

interface Props {
  model: ModelComponent[];
  onSelect: (comp: ModelComponent) => void;
}

const getAllNodes = (model: ModelComponent[], depth = 0): Node[] => {
  let nodes: Node[] = [];

  model.forEach((component, index) => {
    nodes.push({
      id: component.id,
      data: {
        label: (
          <div className="bg-blue-100 border border-blue-300 text-sm px-2 py-1 rounded shadow">
            {component.name}
          </div>
        ),
      },
      position: { x: depth * 180, y: index * 150 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    if (component.children?.length) {
      nodes = nodes.concat(getAllNodes(component.children, depth + 1));
    }
  });

  return nodes;
};

const getAllEdges = (model: ModelComponent[], edges: Edge[] = []): Edge[] => {
  model.forEach((parent) => {
    if (parent.children) {
      parent.children.forEach((child) => {
        edges.push({
          id: `${parent.id}-${child.id}`,
          source: parent.id,
          target: child.id,
        });
        getAllEdges([child], edges);
      });
    }
  });
  return edges;
};

const findById = (
  tree: ModelComponent[],
  id: string,
): ModelComponent | null => {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

const ModelFlow: React.FC<Props> = ({ model, onSelect }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(getAllNodes(model));
  const [edges, setEdges, onEdgesChange] = useEdgesState(getAllEdges(model));

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    setNodes(getAllNodes(model));
    setEdges(getAllEdges(model));
  }, [model]);

  return (
    <ReactFlow
      fitView
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={(_, node) => {
        const selected = findById(model, node.id);
        if (selected) onSelect(selected);
      }}
    >
      <Controls showInteractive={false} />
    </ReactFlow>
  );
};

export default ModelFlow;

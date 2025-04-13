import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ModelComponent } from './types';
import AddComponentForm from './components/component-form';
import ComponentEditor from './components/editor';
import ThreeDViewer from './components/3d-viewer';
import ModelFlow from './components/model-flow';

const App: React.FC = () => {
  const [model, setModel] = useState<ModelComponent[]>([]);
  const [selected, setSelected] = useState<ModelComponent | null>(null);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [parentId, setParentId] = useState<string | null>(null);

  const handleAddComponent = (newComp: ModelComponent) => {
    if (parentId) {
      const updatedModel = addChildToTree([...model], parentId, newComp);
      setModel(updatedModel);
    } else {
      setModel([...model, newComp]);
    }
    setFormVisible(false);
    setParentId(null);
  };

  const handleSelectComponent = (component: ModelComponent) => {
    setSelected(component);
    setParentId(component.id);
  };

  const handleEditComponent = (updatedComp: ModelComponent) => {
    const updatedModel = updateComponentInTree([...model], updatedComp);
    setModel(updatedModel);
    setSelected(null);
    setFormVisible(false);
  };

  const handleDeleteComponent = (id: string) => {
    const updatedModel = deleteComponentTree(model, id);
    setModel(updatedModel);
    setSelected(null);
    setParentId(null);
  };

  const handleAddChild = () => {
    if (selected) {
      setSelected(null);
      setParentId(selected.id);
      setFormVisible(true);
    }
  };

  const handleShowAddForm = () => {
    setSelected(null);
    setParentId(null);
    setFormVisible(true);
  };

  const handleShowEditForm = () => {
    setFormVisible(true);
  };

  const handleCancelEdit = () => {
    setSelected(null);
  };

  const handleAddIceCream = () => {
    const coneId = `cone-${uuidv4()}`;
    const sphereId = `scoop-${uuidv4()}`;
    const parentId = `icecream-${uuidv4()}`;

    const cone: ModelComponent = {
      id: coneId,
      name: 'Cone',
      type: 'Cone',
      dimensions: {
        radius: 0.5,
        height: 2,
      },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: Math.PI, y: 0, z: 0 },
      color: '#d2a679',
      children: [],
      parentId: parentId,
    };

    const sphere: ModelComponent = {
      id: sphereId,
      name: 'Scoop',
      type: 'Sphere',
      dimensions: {
        radius: 0.7,
      },
      position: { x: 0, y: 1.4, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      color: '#ff69b4',
      children: [],
      parentId: parentId,
    };

    const iceCreamGroup: ModelComponent = {
      id: parentId,
      name: 'Ice Cream',
      type: 'Group',
      dimensions: {},
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      color: '',
      children: [cone, sphere],
    };

    setModel([...model, iceCreamGroup]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-1/2 p-4 bg-white border-r relative overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Model Components</h2>
          <div className="flex gap-2">
            <button
              className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
              onClick={handleShowAddForm}
            >
              Open Form
            </button>
            <button
              className="bg-pink-400 text-white text-sm px-3 py-1 rounded hover:bg-pink-500"
              onClick={handleAddIceCream}
            >
              🍦 Add Ice Cream
            </button>
          </div>
        </div>

        {formVisible && (
          <AddComponentForm
            onAdd={handleAddComponent}
            onEdit={handleEditComponent}
            onCancel={() => setFormVisible(false)}
            parentId={parentId}
            editingComponent={selected}
          />
        )}

        <div className="h-full overflow-auto">
          <ModelFlow model={model} onSelect={handleSelectComponent} />
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 p-4 flex flex-col">
        <ThreeDViewer model={model} />
        <ComponentEditor
          component={selected}
          onEdit={handleShowEditForm}
          onAddChild={handleAddChild}
          onDelete={handleDeleteComponent}
          onCancel={handleCancelEdit}
        />
      </div>
    </div>
  );
};

function addChildToTree(
  tree: ModelComponent[],
  parentId: string,
  newChild: ModelComponent,
): ModelComponent[] {
  return tree.map((node) => {
    if (node.id === parentId) {
      return { ...node, children: [...(node.children || []), newChild] };
    }
    if (node.children) {
      return {
        ...node,
        children: addChildToTree(node.children, parentId, newChild),
      };
    }
    return node;
  });
}

function deleteComponentTree(
  tree: ModelComponent[],
  idToDelete: string,
): ModelComponent[] {
  return tree
    .filter((node) => node.id !== idToDelete)
    .map((node) => ({
      ...node,
      children: node.children
        ? deleteComponentTree(node.children, idToDelete)
        : [],
    }));
}

function updateComponentInTree(
  tree: ModelComponent[],
  updatedComp: ModelComponent,
): ModelComponent[] {
  return tree.map((node) => {
    if (node.id === updatedComp.id) {
      return updatedComp;
    }
    if (node.children) {
      return {
        ...node,
        children: updateComponentInTree(node.children, updatedComp),
      };
    }
    return node;
  });
}

export default App;

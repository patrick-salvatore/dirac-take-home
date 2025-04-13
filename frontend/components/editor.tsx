import React from 'react';
import { ModelComponent } from '../types';

interface Props {
  component: ModelComponent | null;
  onEdit: () => void;
  onAddChild: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const ComponentEditor: React.FC<Props> = ({
  component,
  onEdit,
  onAddChild,
  onDelete,
  onCancel,
}) => {
  return (
    <div className="mt-4 p-3 border rounded bg-gray-50">
      {component ? (
        <>
          <h3 className="text-sm font-semibold mb-2">
            Selected: {component.name}
          </h3>
          <p className="text-xs text-gray-500 mb-3">ID: {component.id}</p>

          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              onClick={onAddChild}
            >
              ➕ Add Child
            </button>
            <button
              className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm"
              onClick={onEdit}
            >
              ✏️ Edit Component
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              onClick={() => onDelete(component.id)}
            >
              🗑 Delete
            </button>
            <button
              className="bg-black text-white px-3 py-1 rounded text-sm"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-400 text-sm italic">No component selected</p>
      )}
    </div>
  );
};

export default ComponentEditor;

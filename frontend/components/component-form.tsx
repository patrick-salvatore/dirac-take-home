import React, { useState, useEffect } from 'react';
import { ModelComponent, PrimitiveType } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onEdit: (newComponent: ModelComponent) => void;
  onAdd: (newComponent: ModelComponent) => void;
  onCancel: () => void;
  parentId: string | null;
  editingComponent: ModelComponent | null;
}

// Helpers
const degToRad = (deg: number) => (deg * Math.PI) / 180;
const radToDeg = (rad: number) => (rad * 180) / Math.PI;
const DEFAULT_COLOR = '#0077ff';

const AddComponentForm: React.FC<Props> = ({
  onAdd,
  onCancel,
  onEdit,
  parentId = null,
  editingComponent,
}) => {
  const isEdit = !!editingComponent;

  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR); // Default color
  const [type, setType] = useState<PrimitiveType>('Box');
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotationDeg, setRotationDeg] = useState({ x: 0, y: 0, z: 0 });
  const [dimensions, setDimensions] = useState<any>({
    width: 1,
    height: 1,
    depth: 1,
  });

  useEffect(() => {
    if (editingComponent) {
      setName(editingComponent.name);
      setType(editingComponent.type);
      setPosition(editingComponent.position);
      setRotationDeg({
        x: radToDeg(editingComponent.rotation.x),
        y: radToDeg(editingComponent.rotation.y),
        z: radToDeg(editingComponent.rotation.z),
      });
      setDimensions(editingComponent.dimensions);
      setColor(editingComponent.color || DEFAULT_COLOR);
    } else {
      setName('');
      setType('Box');
      setPosition({ x: 0, y: 0, z: 0 });
      setRotationDeg({ x: 0, y: 0, z: 0 });
      setDimensions({ width: 1, height: 1, depth: 1 });
    }
  }, [editingComponent]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const id = isEdit ? editingComponent!.id : uuidv4();

    const newComponent: ModelComponent = {
      id,
      type,
      name: name.trim() || `${type}-${id}`,
      position,
      rotation: {
        x: degToRad(rotationDeg.x),
        y: degToRad(rotationDeg.y),
        z: degToRad(rotationDeg.z),
      },
      color,
      dimensions,
      children: isEdit ? editingComponent!.children || [] : [],
      ...(parentId ? { parentId } : {}),
    };

    if (isEdit) {
      onEdit(newComponent);
    } else {
      onAdd(newComponent);
    }
  };

  return (
    <div className="mb-4 p-3 bg-white border rounded shadow-sm">
      <h3 className="text-sm font-semibold mb-2">
        {isEdit ? 'Edit Component' : 'Add New Component'}
      </h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          className="border px-2 py-1 rounded w-full mb-2"
          onChange={(e) => setName(e.target.value)}
        />

        <select
          value={type}
          disabled={isEdit}
          onChange={(e) => setType(e.target.value as PrimitiveType)}
          className="border px-2 py-1 rounded w-full mb-2"
        >
          <option value="Box">Box</option>
          <option value="Sphere">Sphere</option>
          <option value="Cylinder">Cylinder</option>
          <option value="Cone">Cone</option>
          <option value="Capsule">Capsule</option>
          <option value="Circle">Circle</option>
        </select>

        {/* Color */}
        <div className="mb-2">
          <label className="block text-sm font-medium">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Position */}
        <div className="mb-2">
          <label className="block text-sm font-medium">
            Position (X, Y, Z)
          </label>
          <div className="flex space-x-2">
            {['x', 'y', 'z'].map((axis) => (
              <input
                key={axis}
                type="number"
                value={position[axis as keyof typeof position]}
                onChange={(e) =>
                  setPosition({
                    ...position,
                    [axis]: parseFloat(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded w-1/3"
                placeholder={axis.toUpperCase()}
              />
            ))}
          </div>
        </div>

        {/* Rotation */}
        <div className="mb-2">
          <label className="block text-sm font-medium">
            Rotation (°) X, Y, Z
          </label>
          <div className="flex space-x-2">
            {['x', 'y', 'z'].map((axis) => (
              <input
                key={axis}
                type="number"
                value={rotationDeg[axis as keyof typeof rotationDeg]}
                onChange={(e) =>
                  setRotationDeg({
                    ...rotationDeg,
                    [axis]: parseFloat(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded w-1/3"
                placeholder={`${axis.toUpperCase()} (°)`}
              />
            ))}
          </div>
        </div>

        {/* Dimensions */}
        {type === 'Box' && (
          <div className="mb-2">
            <label className="block text-sm font-medium">
              Box: Width / Height / Depth
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={dimensions.width || 1}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    width: parseFloat(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded w-1/3"
                placeholder="Width"
              />
              <input
                type="number"
                value={dimensions.height || 1}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    height: parseFloat(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded w-1/3"
                placeholder="Height"
              />
              <input
                type="number"
                value={dimensions.depth || 1}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    depth: parseFloat(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded w-1/3"
                placeholder="Depth"
              />
            </div>
          </div>
        )}

        {type === 'Sphere' && (
          <div className="mb-2">
            <label className="block text-sm font-medium">Sphere: Radius</label>
            <input
              type="number"
              value={dimensions.radius || 0.5}
              onChange={(e) =>
                setDimensions({
                  ...dimensions,
                  radius: parseFloat(e.target.value),
                })
              }
              className="border px-2 py-1 rounded w-full"
              placeholder="Radius"
            />
          </div>
        )}

        {type === 'Cylinder' && (
          <div className="mb-2">
            <label className="block text-sm font-medium">
              Cylinder: RadiusTop / RadiusBottom / Height
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={dimensions.radiusTop || 0.5}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    radiusTop: parseFloat(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded w-1/3"
                placeholder="Top"
              />
              <input
                type="number"
                value={dimensions.radiusBottom || 0.5}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    radiusBottom: parseFloat(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded w-1/3"
                placeholder="Bottom"
              />
              <input
                type="number"
                value={dimensions.height || 1}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    height: parseFloat(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded w-1/3"
                placeholder="Height"
              />
            </div>
          </div>
        )}

        {type === 'Cone' && (
          <div className="mb-2">
            <label className="block text-sm font-medium">
              Cone: Radius / Height
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={dimensions.radius || 0.5}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    radius: parseFloat(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded w-1/2"
                placeholder="Radius"
              />
              <input
                type="number"
                value={dimensions.height || 1}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    height: parseFloat(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded w-1/2"
                placeholder="Height"
              />
            </div>
          </div>
        )}

        {type === 'Capsule' && (
          <div className="mb-2">
            <label className="block text-sm font-medium">
              Capsule: Radius / Length
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={dimensions.radius || 0.5}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    radius: parseFloat(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded w-1/2"
                placeholder="Radius"
              />
              <input
                type="number"
                value={dimensions.length || 1}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    length: parseFloat(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded w-1/2"
                placeholder="Length"
              />
            </div>
          </div>
        )}

        {type === 'Circle' && (
          <div className="mb-2">
            <label className="block text-sm font-medium">Circle: Radius</label>
            <input
              type="number"
              value={dimensions.radius || 1}
              onChange={(e) =>
                setDimensions({
                  ...dimensions,
                  radius: parseFloat(e.target.value),
                })
              }
              className="border px-2 py-1 rounded w-full"
              placeholder="Radius"
            />
          </div>
        )}

        <div className="mt-2">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
          >
            {isEdit ? 'Save Changes' : 'Add Component'}
          </button>
        </div>

        <button
          onClick={onCancel}
          className="w-full mt-2 text-gray-600 hover:underline text-sm"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddComponentForm;

export type PrimitiveType =
  | 'Box'
  | 'Sphere'
  | 'Cylinder'
  | 'Cone'
  | 'Group'
  | 'Capsule'
  | 'Circle';

export interface ModelComponent {
  id: string;
  name: string;
  type: PrimitiveType;
  dimensions: {
    width?: number;
    height?: number;
    radius?: number;
    depth?: number;
    radiusBottom?: number;
    radiusTop?: number;
    length?: number;
  };
  color?: string;
  parentId?: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  children?: ModelComponent[];
}

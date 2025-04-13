import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ModelComponent } from '../types';

interface Props {
  model: ModelComponent[];
}

const ThreeDViewer: React.FC<Props> = ({ model }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    camera.position.set(5, 5, 10);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(ambientLight, directionalLight);

    const addPrimitive = (
      comp: ModelComponent,
      parentGroup?: THREE.Group | THREE.Scene,
    ) => {
      const dims = comp.dimensions || {};
      const pos = comp.position || { x: 0, y: 0, z: 0 };
      const rot = comp.rotation || { x: 0, y: 0, z: 0 };

      let mesh: THREE.Object3D;

      if (comp.type === 'Group') {
        const group = new THREE.Group();
        group.position.set(pos.x, pos.y, pos.z);
        group.rotation.set(rot.x, rot.y, rot.z);

        comp.children?.forEach((child) => addPrimitive(child, group));
        mesh = group;
      } else {
        let geometry: THREE.BufferGeometry;

        switch (comp.type) {
          case 'Box':
            geometry = new THREE.BoxGeometry(
              dims.width || 1,
              dims.height || 1,
              dims.depth || 1,
            );
            break;
          case 'Sphere':
            geometry = new THREE.SphereGeometry(dims.radius || 0.5, 32, 32);
            break;
          case 'Cylinder':
            geometry = new THREE.CylinderGeometry(
              dims.radiusTop || 0.5,
              dims.radiusBottom || 0.5,
              dims.height || 1,
              32,
            );
            break;
          case 'Cone':
            geometry = new THREE.ConeGeometry(
              dims.radius || 0.5,
              dims.height || 1,
              32,
            );
            break;
          case 'Capsule':
            geometry = new THREE.CapsuleGeometry(
              dims.radius || 0.5,
              dims.length || 1,
              8,
              16,
            );
            break;
          case 'Circle':
            geometry = new THREE.CircleGeometry(dims.radius || 1, 32);
            break;
          default:
            geometry = new THREE.BoxGeometry(1, 1, 1);
        }

        const color = comp.color ?? 0x0077ff;
        const material = new THREE.MeshStandardMaterial({ color });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(pos.x, pos.y, pos.z);
        mesh.rotation.set(rot.x, rot.y, rot.z);
      }

      if (parentGroup) {
        parentGroup.add(mesh);
      } else {
        scene.add(mesh);
      }
    };

    model.forEach((comp) => addPrimitive(comp));

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      scene.clear();
      controls.dispose();
    };
  }, [model]);

  return (
    <div ref={mountRef} className="w-full h-[600px] rounded shadow border" />
  );
};

export default ThreeDViewer;

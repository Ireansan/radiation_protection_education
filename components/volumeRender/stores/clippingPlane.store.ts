import create from "zustand";
import * as THREE from "three";

interface ClippingPlaneStates {
    position: THREE.Vector3;
    setPosition: (position: THREE.Vector3) => void;
    matrix: THREE.Matrix4;
    setMatrix: (matrix: THREE.Matrix4) => void;
    normal: number[];
    setNormal: ([x, y, z]: number[]) => void;
    plane: THREE.Plane;
    setPlane: () => void;
}
const clippingPlaneStore = create<ClippingPlaneStates>((set, get) => ({
    position: new THREE.Vector3(0, 0, 0),
    setPosition: (position: THREE.Vector3) => {
        set((state) => ({ position: position }));
    },
    matrix: new THREE.Matrix4(),
    setMatrix: (matrix: THREE.Matrix4) => {
        set((state) => ({ matrix: matrix }));
    },
    normal: [0, 0, -1],
    setNormal: ([x, y, z]: number[]) => {
        set((state) => ({ normal: [x, y, z] }));
    },
    plane: new THREE.Plane(new THREE.Vector3(0, 0, -1), 0),
    setPlane: () => {
        const { normal, position, matrix } = get();
        const normal_vector: THREE.Vector3 = new THREE.Vector3().fromArray(
            normal
        );
        normal_vector.transformDirection(matrix);
        const constant: number = -normal_vector.dot(position);
        // console.log(normal_vector, constant);
        set((state) => ({
            plane: new THREE.Plane(normal_vector, constant),
        }));
    },
}));

export { clippingPlaneStore };

import * as THREE from "three";
import create from "zustand";

/**
 *
 */
interface IState {
    // Plane
    plane: THREE.Plane;
    constant: number;
    matrix4: THREE.Matrix4;
    normal: THREE.Vector3;
    initPlane: (normal: number[], constant: number) => void;
    setPlane: () => void;
    setConstant: (position: THREE.Vector3) => void;
    setNormal: (rotation: THREE.Euler) => void;
    resetPlane: () => void;
    // Animation
    i: number;
    increment: () => void;
    resetIndex: () => void;
}
/**
 *
 */
/*
export const useStoreImpl = create<IState>((set, get) => ({
    plane: new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
    constant: 0,
    matrix4: new THREE.Matrix4(),
    normal: new THREE.Vector3(0, -1, 0),
    initPlane: (normal, constant) => {
        console.log("initPlane");
        const { setPlane } = get();
        set((state) => {
            state.normal.copy(new THREE.Vector3().fromArray(normal));
            state.constant = constant;

            return { ...state };
        });
        setPlane();
    },
    setPlane: () => {
        const { matrix4, normal, constant } = get();

        const normal_vec: THREE.Vector3 = normal.clone();
        normal_vec.transformDirection(matrix4);

        set((state) => {
            state.plane.normal.copy(normal_vec);
            state.plane.constant = constant;

            return { ...state };
        });
    },
    setConstant: (position) => {
        const { setPlane, matrix4, normal } = get();

        const normal_vec: THREE.Vector3 = normal.clone();
        normal_vec.transformDirection(matrix4);
        const constant: number = -normal_vec.dot(position);

        set((state) => {
            state.constant = constant;

            return { ...state };
        });
        setPlane();
    },
    setNormal: (rotation) => {
        const { setPlane } = get();

        const matrix = new THREE.Matrix4();
        matrix.makeRotationFromEuler(rotation);

        set((state) => {
            state.matrix4.copy(matrix);

            return { ...state };
        });
        setPlane();
    },
    resetPlane: () => {
        const { normal } = get();

        set((state) => {
            state.plane.normal.copy(normal);
            state.plane.constant = 0;

            return { ...state };
        });
    },
    i: 0,
    increment: () => {
        set((state) => {
            state.i += 1;

            return {...state}
        })
    },
    resetIndex: () => {
        set((state) => {
            state.i = 0;

            return {...state}
        })
    }
}));
*/
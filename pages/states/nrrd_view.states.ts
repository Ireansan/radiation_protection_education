import { proxy } from "valtio";
import create from "zustand";
import * as THREE from "three";

class VolumeRenderStates {
    volume: any = null;
    clim1: number = 0;
    clim2: number = 1;
    colormap: number = 0;
    renderstyle: string = "iso";
    isothreshold: number = 0.15;
}
const volumeRenderStates = proxy(new VolumeRenderStates());

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
const clippingPlaneStore = create<ClippingPlaneStates>((set, get) => {
    return {
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
            normal_vector.transformDirection(matrix)
            const constant: number = -normal_vector.dot(position);
            // console.log(normal_vector, constant);
            set((state) => ({
                plane: new THREE.Plane(normal_vector, constant),
            }));
        },
    };
});

class TransformConfigStates {
    mode: string = "translate";
    space: string = "world";
}
const transformConfigStates = proxy(new TransformConfigStates());


class ClippingPlaneStates {
    position: THREE.Vector3 = new THREE.Vector3();
    rotation: THREE.Euler = new THREE.Euler();
}
class TypeConfigStates {
    configType: string = "type 1";
    controlsStates: ClippingPlaneStates = new ClippingPlaneStates();
    transfromControlsStates: ClippingPlaneStates = new ClippingPlaneStates();
}
const typeConfigStates = proxy(new TypeConfigStates());

export { volumeRenderStates, clippingPlaneStore, transformConfigStates, typeConfigStates };
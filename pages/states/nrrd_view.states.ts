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

interface ClippingPlaneStates {
    position: THREE.Vector3;
    setPosition: (position: THREE.Vector3) => void;
    matrix: THREE.Matrix4;
    setMatrix: (matrix: THREE.Matrix4) => void;
    normal: number[];
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

/*
class ClippingPlaneStates {
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    matrix: THREE.Matrix4 = new THREE.Matrix4();
    normal: number[] = [0, 0, -1];
    normal_vector: THREE.Vector3 = new THREE.Vector3().fromArray(this.normal);
    constant: number = 0;
    plane = new THREE.Plane(this.normal_vector, 0);;

    calcNormal(): THREE.Vector3 {
        console.log("update Normal");
        const normal_vec: THREE.Vector3 = new THREE.Vector3().fromArray(this.normal);
        return normal_vec.transformDirection(this.matrix);
    }

    calcConstant(): number {
        return -this.normal_vector.dot(this.position);
    }

    updatePlane(): void {
        console.log("update Plane");
        this.normal_vector = this.calcNormal();
        this.constant = this.calcConstant();
        console.log(this.constant)

        this.plane.set(this.normal_vector, this.constant);
    }
}
*/

class TransformConfigStates {
    mode: string = "translate";
    space: string = "world";
    position_base: THREE.Vector3 = new THREE.Vector3();
    rotation_base: THREE.Vector3 = new THREE.Vector3();
}

const volumeRenderStates = proxy(new VolumeRenderStates());
// const clippingPlaneStates = proxy(new ClippingPlaneStates());
const transformConfigStates = proxy(new TransformConfigStates());

export { volumeRenderStates, clippingPlaneStore, transformConfigStates };

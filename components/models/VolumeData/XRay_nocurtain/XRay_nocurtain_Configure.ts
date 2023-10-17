import * as THREE from "three";
import type { CuboidArgs } from "@react-three/rapier";

const XRay_nocurtain_Configure = {
    volume: {
        position: [2.1, 2.2, 2.35] as THREE.Vector3Tuple, // world position
        rotation: [0, Math.PI, -Math.PI / 2] as THREE.Vector3Tuple,
        scale: 1 / 19,
        areaSize: [2.2, 1.2, 3.1] as CuboidArgs,
    },
    object3d: {
        position: [-0.195, 2.05, -0.19] as THREE.Vector3Tuple, // world position
        rotation: [0, 0, Math.PI] as THREE.Vector3Tuple,
        scale: 1 / 5, // local scale
    },
};

export { XRay_nocurtain_Configure };

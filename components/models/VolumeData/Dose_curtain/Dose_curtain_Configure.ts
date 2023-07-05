import * as THREE from "three";

const Dose_curtain_Configure = {
    volume: {
        position: [2.1, 2.2, 2.35] as THREE.Vector3Tuple, // world position
        rotation: [0, Math.PI, -Math.PI / 2] as THREE.Vector3Tuple,
        scale: 1 / 19,
    },
    object3d: {
        position: [-0.195, 2.05, -0.19] as THREE.Vector3Tuple, // world position
        rotation: [0, 0, Math.PI] as THREE.Vector3Tuple,
        scale: 1 / 5, // local scale
    },
};

export { Dose_curtain_Configure };

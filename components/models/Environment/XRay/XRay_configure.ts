import * as THREE from "three";

const XRay_Configure = {
    object3d: {
        position: [-0.196, 0, -0.19] as THREE.Vector3Tuple, // world position
        rotation: [0, -Math.PI / 2, 0] as THREE.Vector3Tuple,
        scale: 1 / 9.4, // local scale
    },
};

export { XRay_Configure };

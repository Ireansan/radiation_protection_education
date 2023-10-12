import * as THREE from "three";

const CArm_roll180_pitch360_Configure = {
    volume: {
        position: [1.8, 0, -1.7] as THREE.Vector3Tuple, // world position
        rotation: [0, 0, Math.PI / 2] as THREE.Vector3Tuple,
        scale: 1 / 19,
        clim2: { timelapse: 1e-6, accumulate: 1e-5 },
    },
    object3d: {
        position: [0, 1.3, 0] as THREE.Vector3Tuple, // world position
        rotation: [0, 0, 0] as THREE.Vector3Tuple,
        scale: 1 / 4.5, // local scale
    },
};

export { CArm_roll180_pitch360_Configure };

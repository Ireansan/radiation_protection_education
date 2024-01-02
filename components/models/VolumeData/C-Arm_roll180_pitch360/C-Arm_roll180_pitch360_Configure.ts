import * as THREE from "three";
import type { CuboidArgs } from "@react-three/rapier";

const CArm_roll180_pitch360_Configure = {
    volume: {
        position: [-1.7, 0, -1.7] as THREE.Vector3Tuple, // world position
        rotation: [0, Math.PI / 2, Math.PI / 2] as THREE.Vector3Tuple,
        scale: 1 / 19,
        clim2: { timelapse: 1e-6, accumulate: 5e-6 },
        climStep: 1e-7,
        areaSize: [1.8, 1.4, 2] as CuboidArgs,
    },
    object3d: {
        position: [0, 1.3, 0] as THREE.Vector3Tuple, // world position
        rotation: [0, Math.PI / 2, 0] as THREE.Vector3Tuple,
        scale: 1 / 4.5, // local scale
        model: {
            position: [-0.875, 0, 0.1] as THREE.Vector3Tuple, // world position
            rotation: [0, Math.PI / 2, 0] as THREE.Vector3Tuple,
            scale: 1.15,
            roll: Math.PI,
            pitch: 0,
            height: 1.15,
        },
        patient: {
            position: [0, 0.2, 0] as THREE.Vector3Tuple, // world position
            rotation: [0, Math.PI / 2, 0] as THREE.Vector3Tuple,
            scale: 1 / 8.5, // local scale
        },
    },
};

export { CArm_roll180_pitch360_Configure };

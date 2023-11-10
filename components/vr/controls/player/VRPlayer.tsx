import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useXR } from "@react-three/xr";

import type { playerProps } from "../../../game";
import { useStore } from "../../../store";

export function VRPlayer({ children }: playerProps) {
    const [set] = useStore((state) => [state.set]);

    const { gl, camera } = useThree();
    const [position, setPosition] = React.useState<THREE.Vector3>(
        new THREE.Vector3(),
    );
    const [direction, setDirection] = React.useState<THREE.Vector3>(
        new THREE.Vector3(),
    );
    const ref = React.useRef<THREE.Group>(null!);

    useFrame((state) => {
        if (!gl.xr.enabled) {
            return;
        }

        if (ref.current) {
            position.copy(camera.position);
            position.y = 0;

            direction.set(0, 0, 1);
            direction
                .applyEuler(camera.rotation)
                .setY(0)
                .multiplyScalar(-1)
                .add(position);

            ref.current.position.copy(position);
            ref.current.lookAt(direction);
        }
    });

    return (
        <>
            {/* @ts-ignore */}
            <group ref={ref}>{children}</group>;
        </>
    );
}

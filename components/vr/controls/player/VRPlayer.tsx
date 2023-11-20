import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import type { playerProps } from "../../../game";
import { useStore } from "../../../store";

export function VRPlayer({ children }: playerProps) {
    const [debug, set] = useStore((state) => [state.debug, state.set]);

    const { gl } = useThree();

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
        gl.xr.updateCamera(state.camera as THREE.PerspectiveCamera);

        position.copy(state.camera.position);
        position.setY(0);

        direction
            .set(0, 0, 1)
            .applyQuaternion(state.camera.quaternion)
            .multiplyScalar(-1)
            .add(position)
            .setY(0);

        if (ref.current) {
            ref.current.position.copy(position);
            ref.current.lookAt(direction);
        }
    });

    return (
        <>
            {/* @ts-ignore */}
            <group ref={ref}>
                {children}

                <mesh position={(0, 0, 0.5)} visible={debug}>
                    <boxBufferGeometry args={[0.1, 0.1, 0.1]} />
                    <meshBasicMaterial color={"blue"} />
                </mesh>
            </group>
        </>
    );
}

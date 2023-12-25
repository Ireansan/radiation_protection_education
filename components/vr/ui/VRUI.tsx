import React from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useStore } from "../../store";

type VRUIElement = {
    children: React.ReactNode;
};

export function VRUI({ children }: VRUIElement) {
    const [debug, set, sceneStates] = useStore((state) => [
        state.debug,
        state.set,
        state.sceneStates,
    ]);
    const { doseOrigin } = sceneStates;

    const { gl } = useThree();

    const ref = React.useRef<THREE.Group>(null!);
    const child = React.useRef<THREE.Group>(null!);

    useFrame((state) => {
        if (!gl.xr.enabled) {
            return;
        }
        gl.xr.updateCamera(state.camera as THREE.PerspectiveCamera);

        const position = state.camera.position.clone().setY(0);
        const target = doseOrigin.clone().setY(0);

        if (ref.current) {
            ref.current.position.copy(position);
            ref.current.lookAt(target);
        }
    });

    return (
        <>
            <group ref={ref}>
                <group
                    ref={child}
                    rotation={[0, Math.PI, 0]}
                >
                    {children}

                    <mesh visible={debug}>
                        <boxBufferGeometry args={[0.1, 0.1, 0.1]} />
                        <meshBasicMaterial color={"red"} />
                    </mesh>
                </group>
            </group>
        </>
    );
}

import React from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useStore } from "../../store";

type VRUIElement = {
    children: React.ReactNode;
};

export function VRUI({ children }: VRUIElement) {
    const [debug, set] = useStore((state) => [state.debug, state.set]);

    const { gl } = useThree();

    const ref = React.useRef<THREE.Group>(null!);
    const child = React.useRef<THREE.Group>(null!);

    useFrame((state) => {
        if (!gl.xr.enabled) {
            return;
        }
        gl.xr.updateCamera(state.camera as THREE.PerspectiveCamera);

        if (ref.current) {
            ref.current.position.copy(state.camera.position);
            ref.current.quaternion.copy(state.camera.quaternion);
        }
    });

    return (
        <>
            <group ref={ref}>
                <group ref={child} position={[0, 0, -1]}>
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

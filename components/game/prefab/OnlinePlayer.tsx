import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import * as MODELS from "../models";
import { useStore } from "../store";

// FIXME: Prototype (2023/06/27)
export function OnlinePlayer({ ...props }: JSX.IntrinsicElements["group"]) {
    const ref = useRef<THREE.Group>(null!);
    const [onlinePlayers] = useStore((state) => [state.onlinePlayers]);

    useFrame(() => {
        if (ref.current && onlinePlayers.player1) {
            ref.current.position.copy(onlinePlayers.player1.position);
            ref.current.quaternion.copy(onlinePlayers.player1.quaternion);
        }
    });

    return (
        <>
            <group ref={ref}>
                <mesh>
                    <boxBufferGeometry />
                </mesh>
            </group>
        </>
    );
}

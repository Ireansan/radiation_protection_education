import React from "react";
import { Html, Stats } from "@react-three/drei";

export function VRStats({ ...props }: JSX.IntrinsicElements["group"]) {
    return (
        <>
            <group {...props}>
                <Html>
                    <Stats />
                </Html>
            </group>
        </>
    );
}

import React from "react";
import { Html, Stats } from "@react-three/drei";

/**
 * @link https://github.com/pmndrs/drei/blob/59d679c5f204b85a959cf06f3e2e16b467158152/src/core/Stats.tsx
 */
export function VRStats({ ...props }: JSX.IntrinsicElements["group"]) {
    return (
        <>
            {console.log("VRStats")}
            <group {...props}>
                <Stats className={"VRStats"} />
                <Html>
                    <div className="VRStats">VRStats</div>
                </Html>
                <mesh>
                    <boxBufferGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial color="red" />
                </mesh>
            </group>
        </>
    );
}

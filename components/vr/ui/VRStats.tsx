import React from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html, Stats } from "@react-three/drei";
// import Stats from "three/examples/jsm/libs/stats.module";

/**
 * @link https://github.com/pmndrs/drei/blob/59d679c5f204b85a959cf06f3e2e16b467158152/src/core/Stats.tsx
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_sandbox.html
 */
export function VRStats({ ...props }: JSX.IntrinsicElements["group"]) {
    const { gl } = useThree();
    const parent = React.useRef<HTMLDivElement>(null!);

    return (
        <>
            {console.log("VRStats", parent.current)}
            <group {...props}>
                <Stats className="vrstats" parent={parent} />
                <Html ref={parent} transform>
                    <div className="vrstats">VRStats</div>
                </Html>
                <mesh>
                    <boxBufferGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial color="red" />
                </mesh>
            </group>
        </>
    );
}

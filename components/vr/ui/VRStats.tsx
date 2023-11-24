import React from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { HTMLMesh, InteractiveGroup } from "three-stdlib";
import Stats from "three/examples/jsm/libs/stats.module";

/**
 * @link https://github.com/pmndrs/drei/blob/59d679c5f204b85a959cf06f3e2e16b467158152/src/core/Stats.tsx
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_sandbox.html
 */
export function VRStats({ ...props }: JSX.IntrinsicElements["group"]) {
    const { gl, camera } = useThree();
    const group = React.useMemo(
        () => new InteractiveGroup(gl, camera),
        [gl, camera],
    );
    const [stats, statsMesh] = React.useMemo(() => {
        // Add stats.js
        // @ts-ignore
        const stats = new Stats();
        stats.dom.style.width = "80px";
        stats.dom.style.height = "48px";
        document.body.appendChild(stats.dom);

        const statsMesh = new HTMLMesh(stats.dom);
        group.add(statsMesh);

        return [stats, statsMesh];
    }, [group]);

    useFrame(() => {
        stats.update();

        // Canvas elements doesn't trigger DOM updates, so we have to update the texture
        /**
         * type:
         * statsMesh.material: MeshBasicMaterial
         * statsMesh.material.map: HTMLTexture
         */
        // @ts-ignore
        statsMesh.material.map.update();
    });

    return (
        <>
            {/*  */}
            <primitive object={group} {...props} />
        </>
    );
}

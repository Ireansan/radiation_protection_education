/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
    nodes: {
        mesh0: THREE.Mesh;
    };
    materials: {};
};

const modelPath = "/models/gltf/dose_region_1002-1019.gltf";

export function Dose_region(props: JSX.IntrinsicElements["group"]) {
    const { nodes, materials } = useGLTF(modelPath) as GLTFResult;
    return (
        <group {...props} dispose={null}>
            <PerspectiveCamera
                makeDefault={false}
                far={906.44}
                near={425.38}
                fov={30}
                position={[-40, -17.5, -726.19]}
            />
            <mesh
                geometry={nodes.mesh0.geometry}
                material={nodes.mesh0.material}
                rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            />
        </group>
    );
}

useGLTF.preload(modelPath);
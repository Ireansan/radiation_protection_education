/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.10 ../../public/models/gltf/c-arm_rotate90_region_1002-1024.gltf -t -o ../../components/models/VolumeData/C-Arm_rotate90/C-Arm_rotate90_region.tsx 
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

import { applyBasePath } from "../../../../utils";
const modelURL = applyBasePath(
    `/models/gltf/c-arm_roll180_pitch360_region_1002-1024.gltf`
);

export function CArm_roll180_pitch360_region(
    props: JSX.IntrinsicElements["group"]
) {
    const { nodes, materials } = useGLTF(modelURL) as GLTFResult;
    return (
        <group {...props} dispose={null}>
            <mesh
                geometry={nodes.mesh0.geometry}
                material={nodes.mesh0.material}
                rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            >
                <meshBasicMaterial color={0xa8a8a8} />
            </mesh>
        </group>
    );
}

useGLTF.preload(modelURL);
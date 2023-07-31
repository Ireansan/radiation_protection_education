/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, useMatcapTexture, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
    nodes: {
        Alpha_Joints: THREE.SkinnedMesh;
        Alpha_Surface: THREE.SkinnedMesh;
        mixamorigHips: THREE.Bone;
    };
    materials: {
        Alpha_Joints_MAT: THREE.MeshStandardMaterial;
        Alpha_Body_MAT: THREE.MeshStandardMaterial;
    };
};

type ActionName = "T-Pose";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

import { applyBasePath } from "../../utils";
const modelURL = applyBasePath(`/models/glb/Y-Bot.glb`);

export function YBot(props: JSX.IntrinsicElements["group"]) {
    const group = useRef<THREE.Group>(null!);
    const { nodes, materials, animations } = useGLTF(
        modelURL
    ) as unknown as GLTFResult;

    return (
        <>
            <group ref={group} {...props} dispose={null}>
                <group name="Scene">
                    <group
                        name="Y-Bot"
                        rotation={[Math.PI / 2, 0, 0]}
                        scale={0.01}
                    >
                        <primitive object={nodes.mixamorigHips} />
                        <skinnedMesh
                            name="Alpha_Joints"
                            geometry={nodes.Alpha_Joints.geometry}
                            material={materials.Alpha_Joints_MAT}
                            skeleton={nodes.Alpha_Joints.skeleton}
                        />
                        <skinnedMesh
                            name="Alpha_Surface"
                            geometry={nodes.Alpha_Surface.geometry}
                            material={materials.Alpha_Body_MAT}
                            skeleton={nodes.Alpha_Surface.skeleton}
                        />
                    </group>
                </group>
            </group>
        </>
    );
}

useGLTF.preload(modelURL);

/*
# Rig Structure

```
mixamorigHips
    L mixamorigSpine
    |   L mixamorigSpine1
    |       L mixamorigSpine2
    |           L mixamorigNeck
    |           |   L mixamorigHead
    |           |       L mixamorigHeadTop_End
    |           L mixamorigLeftShoulder
    |           |   L mixamorigLeftArm
    |           |       L mixamorigLeftForeArm
    |           |           L mixamorigLeftHand
    |           |               L mixamorigLeftHandThumb1
    |           |               |   L mixamorigLeftHandThumb2
    |           |               |       L mixamorigLeftHandThumb3
    |           |               |           L mixamorigLeftHandThumb4
    |           |               L mixamorigLeftHandIndex1
    |           |               |   L mixamorigLeftHandIndex2
    |           |               |       L mixamorigLeftHandIndex3
    |           |               |           L mixamorigLeftHandIndex4
    |           |               L mixamorigLeftHandMiddle1
    |           |               |   L mixamorigLeftHandMiddle2
    |           |               |       L mixamorigLeftHandMiddle3
    |           |               |           L mixamorigLeftHandMiddle4
    |           |               L mixamorigLeftHandRing1
    |           |               |   L mixamorigLeftHandRing2
    |           |               |       L mixamorigLeftHandRing3
    |           |               |           L mixamorigLeftHandRing4
    |           |               L mixamorigLeftHandPinky1
    |           |                   L mixamorigLeftHandPinky2
    |           |                       L mixamorigLeftHandPinky3
    |           |                           L mixamorigLeftHandPinky4
    |           L mixamorigRightShoulder
    |               L mixamorigRightArm
    |                   L mixamorigRightForeArm
    |                       L mixamorigRightHand
    |                           L mixamorigRightHandThumb1
    |                           |   L mixamorigRightHandThumb2
    |                           |       L mixamorigRightHandThumb3
    |                           |           L mixamorigRightHandThumb4
    |                           L mixamorigRightHandIndex1
    |                           |   L mixamorigRightHandIndex2
    |                           |       L mixamorigRightHandIndex3
    |                           |           L mixamorigRightHandIndex4
    |                           L mixamorigRightHandMiddle1
    |                           |   L mixamorigRightHandMiddle2
    |                           |       L mixamorigRightHandMiddle3
    |                           |           L mixamorigRightHandMiddle4
    |                           L mixamorigRightHandRing1
    |                           |   L mixamorigRightHandRing2
    |                           |       L mixamorigRightHandRing3
    |                           |           L mixamorigRightHandRing4
    |                           L mixamorigRightHandPinky1
    |                               L mixamorigRightHandPinky2
    |                                   L mixamorigRightHandPinky3
    |                                       L mixamorigRightHandPinky4
    L mixamorigLeftUpLeg
    |   L mixamorigLeftLeg
    |       L mixamorigLeftFoot
    |           L mixamorigLeftToeBase
    |               L mixamorigLeftToe_End
    L mixamorigRightUpLeg
        L mixamorigRightLeg
            L mixamorigRightFoot
                L mixamorigRightToeBase
                    L mixamorigRightToe_End
```

*/

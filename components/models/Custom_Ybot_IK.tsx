/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, useState, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { GLTF, CCDIKSolver, CCDIKHelper, IKS } from "three-stdlib";

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
import { useFrame } from "@react-three/fiber";
const modelURL = applyBasePath(`/models/glb/Custom_Y-Bot.glb`);

export function CustomYBotIK(props: JSX.IntrinsicElements["group"]) {
    const group = useRef<THREE.Group>(null!);
    const { nodes, materials, animations } = useGLTF(
        modelURL
    ) as unknown as GLTFResult;

    const [ccdIkSolver, ccdIkHelper] = useMemo(() => {
        const iks = [
            {
                target: 33, // "mixamorigLeftHandIK"
                effector: 12, // "mixamorigLeftHand"
                links: [
                    {
                        index: 11, // "mixamorigLeftForeArm"
                        rotationMin: new THREE.Vector3(0.0, 0.0, 0.0),
                        rotationMax: new THREE.Vector3(0.1, 0.1, 1.7),
                    },
                    {
                        index: 10, // "mixamorigLeftArm"
                        rotationMin: new THREE.Vector3(0.0, -1.5, 0.0),
                        rotationMax: new THREE.Vector3(1.5, 0.8, 1.7),
                    },
                ],
            },
            {
                target: 58, // "mixamorigRightHandIK"
                effector: 37, // "mixamorigRightHand"
                links: [
                    {
                        index: 36, // "mixamorigRightForeArm"
                        rotationMin: new THREE.Vector3(0.0, 0.0, -1.7),
                        rotationMax: new THREE.Vector3(0.1, 0.1, 0.0),
                    },
                    {
                        index: 35, // "mixamorigRightArm"
                        rotationMin: new THREE.Vector3(0, -0.8, -1.7),
                        rotationMax: new THREE.Vector3(1.5, 1.5, 0.0),
                    },
                ],
            },
        ] as unknown as IKS[];

        return [
            new CCDIKSolver(nodes.Alpha_Surface, iks),
            // @ts-ignore
            new CCDIKHelper(nodes.Alpha_Surface, iks, 0.025),
        ];
    }, []);

    React.useEffect(() => {
        console.log(group.current);
    }, [group]);

    useFrame(() => {
        ccdIkSolver.update();
    });

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <primitive object={ccdIkHelper} />
                <group
                    name="Custom_Y-Bot"
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                >
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
                    <primitive object={nodes.mixamorigHips} />
                </group>
            </group>
        </group>
    );
}

useGLTF.preload("/Custom_Y-Bot.glb");

/*
# Rig Structure

```
0   mixamorigHips
1       L mixamorigSpine
2       |   L mixamorigSpine1
3       |       L mixamorigSpine2
4       |           L mixamorigNeck
5       |           |   L mixamorigHead
6       |           |       L mixamorigHeadTop_End
7       |           |       L mixamorigLeftEye
8       |           |       L mixamorigRightEye
9       |           L mixamorigLeftShoulder
10      |           |   L mixamorigLeftArm
1       |           |   |   L mixamorigLeftForeArm
2       |           |   |       L mixamorigLeftHand
3       |           |   |           L mixamorigLeftHandThumb1
4       |           |   |           |   L mixamorigLeftHandThumb2
5       |           |   |           |       L mixamorigLeftHandThumb3
6       |           |   |           |           L mixamorigLeftHandThumb4
7       |           |   |           L mixamorigLeftHandIndex1
8       |           |   |           |   L mixamorigLeftHandIndex2
9       |           |   |           |       L mixamorigLeftHandIndex3
20      |           |   |           |           L mixamorigLeftHandIndex4
1       |           |   |           L mixamorigLeftHandMiddle1
2       |           |   |           |   L mixamorigLeftHandMiddle2
3       |           |   |           |       L mixamorigLeftHandMiddle3
4       |           |   |           |           L mixamorigLeftHandMiddle4
5       |           |   |           L mixamorigLeftHandRing1
6       |           |   |           |   L mixamorigLeftHandRing2
7       |           |   |           |       L mixamorigLeftHandRing3
8       |           |   |           |           L mixamorigLeftHandRing4
9       |           |   |           L mixamorigLeftHandPinky1
30      |           |   |               L mixamorigLeftHandPinky2
1       |           |   |                   L mixamorigLeftHandPinky3
2       |           |   |                       L mixamorigLeftHandPinky4
3       |           |   L mixamorigLeftHandIK
4       |           L mixamorigRightShoulder
5       |               L mixamorigRightArm
6       |               |   L mixamorigRightForeArm
7       |               |       L mixamorigRightHand
8       |               |           L mixamorigRightHandThumb1
9       |               |           |   L mixamorigRightHandThumb2
40      |               |           |       L mixamorigRightHandThumb3
1       |               |           |           L mixamorigRightHandThumb4
2       |               |           L mixamorigRightHandIndex1
3       |               |           |   L mixamorigRightHandIndex2
4       |               |           |       L mixamorigRightHandIndex3
5       |               |           |           L mixamorigRightHandIndex4
6       |               |           L mixamorigRightHandMiddle1
7       |               |           |   L mixamorigRightHandMiddle2
8       |               |           |       L mixamorigRightHandMiddle3
9       |               |           |           L mixamorigRightHandMiddle4
50      |               |           L mixamorigRightHandRing1
1       |               |           |   L mixamorigRightHandRing2
2       |               |           |       L mixamorigRightHandRing3
3       |               |           |           L mixamorigRightHandRing4
4       |               |           L mixamorigRightHandPinky1
5       |               |               L mixamorigRightHandPinky2
6       |               |                   L mixamorigRightHandPinky3
7       |               |                       L mixamorigRightHandPinky4
8       |               L mixamorigRightHandIK
9       L mixamorigLeftUpLeg
60      |   L mixamorigLeftLeg
1       |       L mixamorigLeftFoot
2       |           L mixamorigLeftToeBase
3       |               L mixamorigLeftToe_End
4       L mixamorigRightUpLeg
5           L mixamorigRightLeg
6               L mixamorigRightFoot
7                   L mixamorigRightToeBase
8                       L mixamorigRightToe_End
```

*/

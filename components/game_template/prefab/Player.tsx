import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { useThree, useFrame } from "@react-three/fiber";
import {
    CapsuleCollider,
    RigidBody,
    RigidBodyApi,
    useRapier,
} from "@react-three/rapier";
import { useGLTF, useMatcapTexture, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";

import { getState, mutation, useStore } from "../store";
import type { Controls } from "../store";
import { getWorldPosition, getWorldDirection, lookAtSlerp } from "./utils";

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

type ActionName =
    | "FallingIdle"
    | "Idle"
    | "JumpDown"
    | "JumpUp"
    | "LeftStrafeWalking"
    | "RightStrafeWalking"
    | "StandardWalk"
    | "TPose"
    | "WalkingBackward";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

import { applyBasePath } from "../../utils";
const modelURL = applyBasePath(`/models/glb/ybot.glb`);

export function Player(props: JSX.IntrinsicElements["group"]) {
    // Base
    const [cameraMode, editor, playerConfig] = useStore((state) => [
        state.camera,
        state.editor,
        state.playerConfig,
    ]);
    const { radius, halfHeight, moveSpeed, boost, cameraDistance } =
        playerConfig;
    const { bodyMatcap, jointMatcap } = playerConfig;

    // Model
    const group = useRef<THREE.Group>(new THREE.Group());
    const { nodes, materials, animations } = useGLTF(
        modelURL
    ) as unknown as GLTFResult;
    const { actions, mixer } = useAnimations(animations, group);
    const [BodyMatcap] = useMatcapTexture(bodyMatcap, 512);
    const [JointMatcap] = useMatcapTexture(jointMatcap, 512);

    // RigidBody
    const rigidBody = useRef<RigidBodyApi>(null);
    const rapier = useRapier();
    const { camera } = useThree();

    let controls: Controls;
    let isBoosting = false;
    let maxToi = 5.0;
    let solid = false;

    // Movement
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    // Plyaer
    const rigidbodyPosition = new THREE.Vector3();
    const playerPosition = new THREE.Vector3();
    const playerDirection = new THREE.Vector3();

    /**
     * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_blending.html
     */
    function setWeight(actionName: ActionName, weight: number) {
        if (actions[actionName]) {
            actions[actionName]!.enabled = true;
            // actions[actionName]!.setEffectiveTimeScale(1);
            actions[actionName]!.setEffectiveWeight(weight);
        }
    }

    useEffect(() => {
        // activate all actions
        const actionNames: ActionName[] = [
            "Idle",
            "StandardWalk",
            "WalkingBackward",
            "LeftStrafeWalking",
            "RightStrafeWalking",
            "FallingIdle",
            "TPose",
        ];

        actionNames.forEach(function (actionName: ActionName) {
            setWeight(actionName, actionName === "Idle" ? 1 : 0);
            actions[actionName]?.play();
        });
    }, []);

    useFrame((state, delta, event) => {
        controls = getState().controls;
        const { forward, backward, left, right, jump } = controls;
        isBoosting = controls.boost;

        if (rigidBody.current) {
            // update group position, rotation
            const velocity = rigidBody.current.linvel();
            rigidbodyPosition.copy(rigidBody.current.translation());

            playerPosition.copy(rigidbodyPosition);
            playerPosition.y -= radius + halfHeight;

            playerDirection.set(0, 0, 1);
            playerDirection
                .applyEuler(camera.rotation)
                .setY(0)
                .multiplyScalar(-1)
                .add(playerPosition);

            if (group.current) {
                group.current.position.copy(playerPosition);
                group.current.lookAt(playerDirection);
            }

            // update camera
            if (!editor) {
                const headPosition = new THREE.Vector3().copy(
                    rigidbodyPosition
                );
                headPosition.y += halfHeight;

                if (cameraMode === "FIRST_PERSON") {
                    camera.position.copy(headPosition);
                } else if (cameraMode === "THIRD_PERSON") {
                    const cameraPositionOffset = new THREE.Vector3();
                    camera.getWorldDirection(cameraPositionOffset);
                    cameraPositionOffset.setLength(cameraDistance);

                    camera.position.subVectors(
                        headPosition,
                        cameraPositionOffset
                    );
                }
            }

            // movement
            frontVector.set(0, 0, Number(backward) - Number(forward));
            sideVector.set(Number(left) - Number(right), 0, 0);
            direction
                .subVectors(frontVector, sideVector)
                .normalize()
                .multiplyScalar(moveSpeed * (isBoosting ? boost : 1))
                .applyEuler(camera.rotation);
            rigidBody.current.setLinvel({
                x: direction.x,
                y: velocity.y,
                z: direction.z,
            });

            // jumping
            const world = rapier.world.raw();
            const ray = world.castRay(
                new RAPIER.Ray(rigidBody.current.translation(), {
                    x: 0,
                    y: -1,
                    z: 0,
                }),
                maxToi,
                solid
            );
            const grounded =
                ray && ray.collider && Math.abs(ray.toi) <= radius + halfHeight;
            if (jump && grounded) {
                rigidBody.current.setLinvel({ x: 0, y: 7.5, z: 0 });
            }

            // animation
            var movementSum =
                Number(forward) +
                Number(backward) +
                Number(left) +
                Number(right);
            setWeight(
                "Idle",
                !jump && grounded && !Boolean(movementSum) ? 1 : 0
            );
            setWeight("FallingIdle", !grounded ? 1 : 0);
            setWeight(
                "StandardWalk",
                !jump && grounded ? Number(forward) / movementSum : 0
            );
            setWeight(
                "WalkingBackward",
                !jump && grounded ? Number(backward) / movementSum : 0
            );
            setWeight(
                "LeftStrafeWalking",
                !jump && grounded
                    ? Number((left && !backward) || (right && backward)) /
                          movementSum
                    : 0
            );
            setWeight(
                "RightStrafeWalking",
                !jump && grounded
                    ? Number((right && !backward) || (left && backward)) /
                          movementSum
                    : 0
            );

            mixer.update(delta);
        }
    });

    return (
        <>
            <RigidBody
                ref={rigidBody}
                colliders={false}
                mass={1}
                type="dynamic"
                position={[0, 10, 0]}
                enabledRotations={[false, false, false]}
            >
                <CapsuleCollider args={[halfHeight, radius]} />
            </RigidBody>
            {/* Y Bot */}
            <group ref={group} {...props} dispose={null}>
                <group name="Scene">
                    <group
                        name="Armature"
                        rotation={[Math.PI / 2, 0, 0]}
                        scale={0.01}
                    >
                        <primitive object={nodes.mixamorigHips} />
                        <skinnedMesh
                            name="Alpha_Joints"
                            geometry={nodes.Alpha_Joints.geometry}
                            material={materials.Alpha_Joints_MAT}
                            skeleton={nodes.Alpha_Joints.skeleton}
                        >
                            <meshMatcapMaterial
                                attach="material"
                                matcap={JointMatcap}
                            />
                        </skinnedMesh>
                        <skinnedMesh
                            name="Alpha_Surface"
                            geometry={nodes.Alpha_Surface.geometry}
                            material={materials.Alpha_Body_MAT}
                            skeleton={nodes.Alpha_Surface.skeleton}
                        >
                            <meshMatcapMaterial
                                attach="material"
                                matcap={BodyMatcap}
                            />
                        </skinnedMesh>
                    </group>
                </group>
            </group>
        </>
    );
}

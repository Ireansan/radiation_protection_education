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

import { getState, mutation, useStore } from "../store";
import type { Controls } from "../store";

import { AnimationStates } from "../controls";
import { YBot } from "../models";

import { applyBasePath } from "../../utils";
const modelURL = applyBasePath(`/models/glb/ybot.glb`);

export function Player(props: JSX.IntrinsicElements["group"]) {
    // Base
    const [cameraMode, editor, debug, playerConfig] = useStore((state) => [
        state.camera,
        state.editor,
        state.debug,
        state.playerConfig,
    ]);
    const { set } = useStore(({ set }) => ({
        set,
    }));

    const { radius, halfHeight, moveSpeed, boost, cameraDistance } =
        playerConfig;
    const { bodyMatcap, jointMatcap } = playerConfig;

    // Animation
    const { mixer, ref } = AnimationStates();

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

            /*
            if (group.current) {
                group.current.position.copy(playerPosition);

                if (!editor) {
                    group.current.lookAt(playerDirection);
                }
            }
            */
            if (ref.current) {
                ref.current.position.copy(playerPosition);

                if (!editor) {
                    ref.current.lookAt(playerDirection);
                }
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
                .multiplyScalar(moveSpeed * (isBoosting ? boost : 1));
            if (!editor) {
                direction.applyEuler(camera.rotation);
            }
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
            const grounded: boolean = ray
                ? ray.collider && Math.abs(ray.toi) <= radius + halfHeight
                : false;
            if (jump && grounded) {
                rigidBody.current.setLinvel({ x: 0, y: 10, z: 0 });
            }

            set((state) => ({ controls: { ...state.controls, grounded } }));
        }

        mixer.update(delta);
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
            <group ref={ref}>
                <YBot />
            </group>
        </>
    );
}

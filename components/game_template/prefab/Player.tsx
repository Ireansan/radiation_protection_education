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

import { Sphere } from "@react-three/drei";

import { getState, mutation, useStore } from "../store";
import type { Controls } from "../store";
import { Ybot, Ybot_with_Animation } from "../models";

export function Player({}) {
    const groupRef = useRef<THREE.Group>(new THREE.Group());
    const ref = useRef<RigidBodyApi>(null);
    const rapier = useRapier();
    const { camera } = useThree();

    const [cameraMode, editor, playerConfig] = useStore((state) => [
        state.camera,
        state.editor,
        state.playerConfig,
    ]);
    const { radius, halfHeight, moveSpeed, boost, cameraDistance } =
        playerConfig;
    // const { frontVector, sideVector, direction } = mutation;

    let controls: Controls;
    let isBoosting = false;
    let maxToi = 4.0;
    let solid = true;

    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    const rigidbodyPosition = new THREE.Vector3();
    const playerPosition = new THREE.Vector3();

    useFrame((state, delta, event) => {
        controls = getState().controls;
        const { forward, backward, left, right, jump } = controls;
        isBoosting = controls.boost;

        if (ref.current) {
            const velocity = ref.current.linvel();
            rigidbodyPosition.copy(ref.current.translation());
            playerPosition.copy(rigidbodyPosition);
            playerPosition.y -= radius + halfHeight;

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
            ref.current.setLinvel({
                x: direction.x,
                y: velocity.y,
                z: direction.z,
            });

            // jumping
            const world = rapier.world.raw();
            const ray = world.castRay(
                new RAPIER.Ray(ref.current.translation(), {
                    x: 0,
                    y: -1,
                    z: 0,
                }),
                maxToi,
                solid
            );
            const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75;
            if (jump && grounded) {
                ref.current.setLinvel({ x: 0, y: 7.5, z: 0 });
            }
        }

        // update group position
        if (groupRef.current) {
            groupRef.current.position.copy(playerPosition);
        }

        // TODO:
        // console.log(event);
    });

    return (
        <>
            <RigidBody
                ref={ref}
                colliders={false}
                mass={1}
                type="dynamic"
                position={[0, 10, 0]}
                enabledRotations={[false, false, false]}
            >
                <CapsuleCollider args={[halfHeight, radius]} />
            </RigidBody>
            <group ref={groupRef}>
                {/* <Ybot /> */}
                <Ybot_with_Animation />
            </group>
        </>
    );
}

import React, { useRef } from "react";

import { Sky } from "@react-three/drei";
import * as THREE from "three";
import { Physics, Debug } from "@react-three/rapier";
import {
    VolumeGroup,
    VolumeAnimationObject,
    VolumeAnimationControls,
    VolumeParameterControls,
    VolumeClippingControls,
} from "../volumeRender";
import * as Models from "../models";

import { GameTemplate, Ground, Player, YBot } from "../game_template";

function XRayRoomGame() {
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation = useRef<VolumeAnimationObject>(null);

    const xOffset: number = -5;
    const zOffset: number = 0;

    return (
        <>
            <GameTemplate
                childrenEnv={
                    <>
                        <Sky sunPosition={[100, 20, 100]} />
                        <ambientLight intensity={0.3} />
                        <pointLight
                            castShadow
                            intensity={0.8}
                            position={[100, 100, 100]}
                        />

                        {/* Volume Render */}
                        <volumeGroup ref={ref}>
                            <volumeAnimationObject
                                ref={refAnimation}
                                position={[2.1 + xOffset, 2.2, 2.35 + zOffset]}
                                rotation={[0, Math.PI, -Math.PI / 2]}
                                scale={1 / 20}
                            >
                                <Models.Dose_all_Animation />
                            </volumeAnimationObject>
                        </volumeGroup>

                        <group
                            position={[0 + xOffset, 2, 0 + zOffset]}
                            rotation={[0, 0, Math.PI]}
                            scale={(1 / 4) * (1 / 20)}
                        >
                            <Models.Dose_material />
                            <Models.Dose_region />
                        </group>

                        <VolumeAnimationControls
                            objects={[refAnimation]}
                            duration={16}
                        />
                        <VolumeParameterControls object={ref} />
                        <VolumeClippingControls
                            object={ref}
                            folderName="Stent"
                            normals={[
                                [0, 0, -1],
                                // [-1, 0, 0],
                            ]}
                        />

                        {/* Helper */}
                        {/* <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                            <GizmoViewport
                                axisColors={[
                                    "hotpink",
                                    "aquamarine",
                                    "#3498DB",
                                ]}
                                labelColor="black"
                            />
                        </GizmoHelper> */}
                    </>
                }
                childrenPhysics={
                    <>
                        <Ground />
                        <Player>
                            <YBot />
                        </Player>
                    </>
                }
            />
        </>
    );
}

export default XRayRoomGame;

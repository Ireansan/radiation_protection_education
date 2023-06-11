import React from "react";

import { extend } from "@react-three/fiber";
import { Sky, GizmoHelper, GizmoViewport } from "@react-three/drei";
import * as THREE from "three";

import { VolumeGroup } from "../../src";
import {
    VolumeParameterControls,
    VolumeClippingControls,
} from "../volumeRender";
import * as Models from "../models";

import { GameTemplate, Ground, Player, YBot } from "../game_template";

function StentGame() {
    const ref = React.useRef<VolumeGroup>(null!);

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
                            <Models.Stent
                                position={[-5, 1, -4]}
                                rotation={[-Math.PI / 2, 0, 0]}
                                scale={1 / 128}
                            />
                        </volumeGroup>

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
                        <GizmoHelper
                            alignment="bottom-right"
                            margin={[80, 80]}
                            renderPriority={-1}
                        >
                            <GizmoViewport
                                axisColors={[
                                    "hotpink",
                                    "aquamarine",
                                    "#3498DB",
                                ]}
                                labelColor="black"
                            />
                        </GizmoHelper>
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

export default StentGame;

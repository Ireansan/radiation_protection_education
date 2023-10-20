import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { VRButton, XR, Interactive, Controllers } from "@react-three/xr";
import { Stats } from "@react-three/drei";

// ==========
// Volume
// ----------
// object
import { VolumeGroup, DoseAnimationObject } from "../../src";
// ----------
// data
import * as VOLUMEDATA from "../../components/models/VolumeData";
// ----------
// controls
import {
    VolumeAnimationControls,
    VolumeXYZClippingControls,
    VolumeParameterControls,
} from "../../components/volumeRender";

function XRayRoomVR() {
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation = useRef<DoseAnimationObject>(null);

    return (
        <>
            <VRButton />

            {/* ================================================== */}
            {/* Three.js Canvas */}
            <Canvas>
                <XR>
                    {/* -------------------------------------------------- */}
                    {/* Volume Object */}
                    <volumeGroup ref={ref}>
                        <doseAnimationObject
                            ref={refAnimation}
                            position={VOLUMEDATA.Dose_Configure.volume.position}
                            rotation={VOLUMEDATA.Dose_Configure.volume.rotation}
                            scale={VOLUMEDATA.Dose_Configure.volume.scale}
                        >
                            <VOLUMEDATA.Dose_all_Animation />
                        </doseAnimationObject>
                    </volumeGroup>

                    {/* -------------------------------------------------- */}
                    {/* Volume Controls */}
                    <VolumeAnimationControls
                        objects={[refAnimation]}
                        duration={16}
                    />
                    <VolumeParameterControls object={ref} />
                    <VolumeXYZClippingControls object={ref} planeSize={2} />

                    {/* -------------------------------------------------- */}
                    {/* Three.js Object */}
                    <group
                        position={VOLUMEDATA.Dose_Configure.object3d.position}
                        rotation={VOLUMEDATA.Dose_Configure.object3d.rotation}
                        scale={
                            VOLUMEDATA.Dose_Configure.volume.scale *
                            VOLUMEDATA.Dose_Configure.object3d.scale
                        }
                    >
                        <VOLUMEDATA.Dose_material />
                        <VOLUMEDATA.Dose_region />
                    </group>
                </XR>

                {/* -------------------------------------------------- */}
                {/* Enviroment */}
                <ambientLight intensity={0.5} />

                {/* ================================================== */}
                {/* UI */}
                <Stats />
            </Canvas>
        </>
    );
}

export default XRayRoomVR;

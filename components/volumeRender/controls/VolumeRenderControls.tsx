import React from "react";
import * as THREE from "three";
import { useControls, folder } from "leva";
import { useSnapshot } from "valtio";

import {
    typeConfigStates,
    animationStates,
} from "../../../lib/states/volumeRender.Controls.state";
import clippingPlaneStore from "../../../lib/states/clippingPlane.state";

import VolumeRenderConfigControls from "./VolumeRenderConfigControls";
import ClippingPlaneTransformControls from "./ClippingPlaneTransformControls";
import ClippingPlaneControls from "./ClippingPlaneControls";
import AnimationControls from "./AnimationControls";

/** */
function VolumeRenderControls() {
    const { position, setPosition, matrix, setMatrix, setPlane } =
        clippingPlaneStore();
    const { configType, controlsStates, transfromControlsStates } =
        useSnapshot(typeConfigStates);
    const { animation } = useSnapshot(animationStates);

    const [typeConfig, setConfig] = useControls(() => ({
        type: {
            value: "type 1",
            options: ["type 1", "type 2"],
            onChange: (e) => {
                const position_: THREE.Vector3 = new THREE.Vector3();
                const matrix_: THREE.Matrix4 = new THREE.Matrix4();

                if (e === "type 1") {
                    position_.copy(transfromControlsStates.position);
                    matrix_.makeRotationFromEuler(
                        transfromControlsStates.rotation
                    );
                    typeConfigStates.configType = e;
                } else if (e === "type 2") {
                    position_.copy(controlsStates.position);
                    matrix_.makeRotationFromEuler(controlsStates.rotation);
                    typeConfigStates.configType = e;
                }

                setPosition(position_);
                setMatrix(matrix_);
                setPlane();
            },
        },
    }));

    return (
        <>
            <VolumeRenderConfigControls />
            {configType === "type 1" && <ClippingPlaneTransformControls />}
            {configType === "type 2" && <ClippingPlaneControls />}
            {animation && <AnimationControls />}
        </>
    );
}

export default VolumeRenderControls;

import React, { useEffect } from "react";
import * as THREE from "three";
import { useControls, folder } from "leva";
import { useSnapshot } from "valtio";

import {
    clippingPlaneControlsStates,
    clippingPlaneTransformControlsStates,
    clippingPlanePanelControlsStates,
} from "../states";
import { clippingPlaneStore } from "../stores";

import {
    ClippingPlaneTransformControls,
    ClippingPlanePanelControls,
} from "./index";

/**
 * @function ClippingPlaneControls
 * @abstract
 */
function ClippingPlaneControls({}) {
    // ClippingPlane State
    const [setPosition, setMatrix, setPlane] = clippingPlaneStore((state) => [
        state.setPosition,
        state.setMatrix,
        state.setPlane,
    ]);
    // Controls State
    const { type } = useSnapshot(clippingPlaneControlsStates);
    // TransformControls State
    const transfromControlsStates = useSnapshot(
        clippingPlaneTransformControlsStates
    );
    const panelControlsStates = useSnapshot(clippingPlanePanelControlsStates);

    const typeConfig = useControls("plane control", {
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
                } else if (e === "type 2") {
                    position_.copy(panelControlsStates.position);
                    matrix_.makeRotationFromEuler(panelControlsStates.rotation);
                }

                clippingPlaneControlsStates.type = e;
                setPosition(position_);
                setMatrix(matrix_);
                setPlane();
            },
        },
    });

    useEffect(() => {
        console.log("typeConfig", typeConfig);
    }, [typeConfig]);

    return (
        <>
            {type === "type 1" && <ClippingPlaneTransformControls />}
            {type === "type 2" && <ClippingPlanePanelControls />}
        </>
    );
}

export default ClippingPlaneControls;

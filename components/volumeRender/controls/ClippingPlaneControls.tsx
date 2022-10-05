import React from "react";
import * as THREE from "three";
import { useControls, folder } from "leva";
import { useSnapshot } from "valtio";

import {
    clippingPlaneStore,
    clippingPlaneTransformControlsStates,
    clippingPlanePanelControlsStates,
} from "../states";

import {
    ClippingPlaneTransformControls,
    ClippingPlanePanelControls,
} from "./index";

/**
 * @function ClippingPlaneControls
 * @abstract
 */
function ClippingPlaneControls({}) {
    const { setPosition, setMatrix, setPlane } = clippingPlaneStore();
    const transfromControlsStates = useSnapshot(
        clippingPlaneTransformControlsStates
    );
    const panelControlsStates = useSnapshot(clippingPlanePanelControlsStates);

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
                } else if (e === "type 2") {
                    position_.copy(panelControlsStates.position);
                    matrix_.makeRotationFromEuler(panelControlsStates.rotation);
                }

                setPosition(position_);
                setMatrix(matrix_);
                setPlane();
            },
        },
    }));

    return (
        <>
            {typeConfig === "type 1" && <ClippingPlaneTransformControls />}
            {typeConfig === "type 2" && <ClippingPlanePanelControls />}
        </>
    );
}

export default ClippingPlaneControls;

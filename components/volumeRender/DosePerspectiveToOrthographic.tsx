import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

import { VolumeBase } from "../../src";

type dosePerspectiveToOrthographicProps = {
    control: React.RefObject<OrbitControls>;
    objects: React.RefObject<VolumeBase>[];
    zoom?: number;
};
/**
 * @link https://github.com/pmndrs/react-three-fiber/blob/2ed531a780579d1886dd0ff7ebdcfb8e14b9a8c2/packages/fiber/src/core/utils.ts#L445
 * packages/fiber/src/core/utils.ts > function updateCamera(camera: Camera & { manual?: boolean }, size: Size)
 */
export function DosePerspectiveToOrthographic({
    control,
    objects,
    zoom = 1,
    ...props
}: dosePerspectiveToOrthographicProps) {
    const orthographicCamera = new THREE.OrthographicCamera();

    useFrame((state) => {
        const { camera, size } = state;

        if (camera instanceof THREE.PerspectiveCamera && control.current) {
            orthographicCamera.left = size.width / -2;
            orthographicCamera.right = size.width / 2;
            orthographicCamera.top = size.height / 2;
            orthographicCamera.bottom = size.height / -2;
            // orthographicCamera.zoom = camera.zoom; // then perspective, no update

            const controlCameraDistance = control.current.getDistance();
            orthographicCamera.zoom = (zoom * 1) / controlCameraDistance; // FIXME:

            orthographicCamera.updateProjectionMatrix();

            objects.forEach((ref) => {
                if (ref.current) {
                    ref.current.projectionMatrix =
                        orthographicCamera.projectionMatrix;
                }
            });
        }
    });

    return <></>;
}

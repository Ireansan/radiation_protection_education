import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

import { VolumeBase } from "../../src";

type dosePerspectiveToOrthographicProps = {
    object: React.RefObject<VolumeBase>;
    control?: React.RefObject<OrbitControls>;
    zoom?: number;
};
/**
 * @link https://github.com/pmndrs/react-three-fiber/blob/2ed531a780579d1886dd0ff7ebdcfb8e14b9a8c2/packages/fiber/src/core/utils.ts#L445
 * packages/fiber/src/core/utils.ts > function updateCamera(camera: Camera & { manual?: boolean }, size: Size)
 */
export function DosePerspectiveToOrthographic({
    object,
    control,
    zoom = 1,
    ...props
}: dosePerspectiveToOrthographicProps) {
    const orthographicCamera = new THREE.OrthographicCamera();

    const [center, setCenter] = React.useState<THREE.Vector3>(
        new THREE.Vector3(),
    );

    React.useEffect(() => {
        if (object.current) {
            const objectCenter = new THREE.Vector3(); // recommend: select object layer is world
            const bbox = new THREE.Box3().setFromObject(object.current);
            bbox.getCenter(objectCenter);

            setCenter(objectCenter);
        }
    }, [object]);

    useFrame((state) => {
        const { camera, size } = state;

        if (camera instanceof THREE.PerspectiveCamera) {
            orthographicCamera.left = size.width / -2;
            orthographicCamera.right = size.width / 2;
            orthographicCamera.top = size.height / 2;
            orthographicCamera.bottom = size.height / -2;
            // orthographicCamera.zoom = camera.zoom; // then perspective, no update

            if (control && control.current) {
                const controlCameraDistance = control.current.getDistance();
                orthographicCamera.zoom = (zoom * 1) / controlCameraDistance;
            } else {
                const cameraWorldPosition = new THREE.Vector3();
                const cameraWorldDirection = new THREE.Vector3();

                const cameraToCenter = new THREE.Vector3();

                camera.getWorldPosition(cameraWorldPosition);
                camera.getWorldDirection(cameraWorldDirection);
                cameraWorldDirection.normalize();

                cameraToCenter.copy(center).sub(cameraWorldPosition); // vector from cameraWorldPosition to objectCenter
                const distance = cameraToCenter.length();
                orthographicCamera.zoom = zoom / distance;
            }

            orthographicCamera.updateProjectionMatrix();

            if (object.current) {
                // object.current.projectionMatrix =
                //     orthographicCamera.projectionMatrix;

                const positionView = center
                    .clone()
                    .applyMatrix4(camera.matrixWorldInverse);
                const shearMatrix = new THREE.Matrix4().makeShear(
                    0,
                    Math.abs(positionView.x / positionView.z),
                    0,
                    Math.abs(positionView.y / positionView.z),
                    0,
                    0,
                );
                // object.current.projectionMatrix = shearMatrix;
                // console.log(
                //     positionView.toArray()
                //     // camera.matrixWorldInverse.toArray()
                // );
            }
        }
    });

    return (
        <>
            {/* FIXME: for Debug */}
            <mesh position={center}>
                <boxBufferGeometry args={[0.5, 0.5, 0.5]} />
                <meshBasicMaterial color={"red"} />
            </mesh>
        </>
    );
}

import * as THREE from "three";

/**
 *
 * @param object
 * @returns
 */
export function getWorldPosition(object: THREE.Object3D): THREE.Vector3 {
    const tmpWorldPosition = new THREE.Vector3();
    object.getWorldPosition(tmpWorldPosition);

    return tmpWorldPosition.clone();
}

/**
 *
 * @param object
 * @param xy
 * @returns
 */
export function getWorldDirection(
    object: THREE.Object3D,
    xy: boolean = false
): THREE.Vector3 {
    const tmpWorldDirection = new THREE.Vector3();
    object.getWorldDirection(tmpWorldDirection);

    if (xy) {
        tmpWorldDirection.y = 0;
    }

    return tmpWorldDirection.clone();
}

/**
 *
 * @param object
 * @param startVector
 * @param endVector
 * @param t
 */
export function lookAtSlerp(
    object: THREE.Object3D,
    startVector: THREE.Vector3,
    endVector: THREE.Vector3,
    t: number = 0.01
): void {
    object.lookAt(endVector);
    const endQuaternion = new THREE.Quaternion().copy(object.quaternion);

    object.lookAt(startVector);
    const startQuaternion = new THREE.Quaternion().copy(object.quaternion);

    object.quaternion.slerpQuaternions(startQuaternion, endQuaternion, t);
}

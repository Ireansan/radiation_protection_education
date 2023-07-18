import * as THREE from "three";

class IKControls extends THREE.Object3D {
    object: THREE.Object3D | undefined;

    isIKControls: boolean;

    constructor() {
        super();

        this.object = undefined;
        this.visible = false;

        this.isIKControls = true;
    }

    // Set current object
    attach(object: THREE.Object3D) {
        this.object = object;
        this.visible = true;

        return this;
    }

    // Detach from object
    detach() {
        this.object = undefined;
        this.visible = false;

        return this;
    }

    /**
     *
     * @param name ik bone
     * @param position world position
     */
    setWorldPosition(name: string, position: THREE.Vector3) {
        if (this.object) {
            let ik = this.object.getObjectByName(name);
            let ikParent = ik?.parent;

            // set IK position
            if (ik && ikParent) {
                ik.position.copy(ikParent.worldToLocal(position));
            }
        }
    }

    /**
     *
     * @param name ik bone
     * @param position local position
     */
    setLocalPosition(name: string, position: THREE.Vector3) {
        if (this.object) {
            let worldPosition = this.object.localToWorld(position);

            this.setWorldPosition(name, worldPosition);
        }
    }
}

export { IKControls };

import React from "react";
import { extend, ReactThreeFiber } from "@react-three/fiber";

import { DoseAnimationObject } from "./doseAnimationObject";
import { DoseGroup } from "./doseGroup";
import { DoseObject } from "./doseObject";
extend({ DoseAnimationObject, DoseGroup, DoseObject });

export type DoseAnimationObjectProps = ReactThreeFiber.Object3DNode<
    DoseAnimationObject,
    typeof DoseAnimationObject
>;
export type DoseGroupProps = ReactThreeFiber.Object3DNode<
    DoseGroup,
    typeof DoseGroup
>;
export type DoseObjectProps = ReactThreeFiber.Object3DNode<
    DoseObject,
    typeof DoseObject
>;

/**
 * @link https://github.com/pmndrs/react-three-fiber/blob/4121b109a71dd266ea6bdef8b4e0a2970b1a40de/packages/fiber/src/three-types.ts
 */
declare module "@react-three/fiber" {
    interface ThreeElements {
        doseAnimationObject: DoseAnimationObjectProps;
        doseGroup: DoseGroup;
        doseObject: DoseObject;
    }
}

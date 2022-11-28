/**
 * @link https://github.com/pmndrs/react-three-fiber/blob/26cf7eed4f9bddd79305a1f61b20554b07fdff1b/docs/tutorials/typescript.mdx#extend-usage
 */
import { ReactThreeFiber } from "@react-three/fiber";

import { VolumeAnimationObject } from "./VolumeAnimationObject";
import { VolumeObject } from "./VolumeObject";
import { VolumeGroup } from "./VolumeGroup";

export type VolumeAnimationObjectProps = ReactThreeFiber.Node<
    VolumeAnimationObject,
    typeof VolumeAnimationObject
>;
export type VolumeObjectProps = ReactThreeFiber.Node<
    VolumeObject,
    typeof VolumeObject
>;
export type VolumeGroupProps = ReactThreeFiber.Node<
    VolumeGroup,
    typeof VolumeGroup
>;

declare module "@react-three/fiber" {
    interface ThreeElements {
        volumeAnimationObject: VolumeAnimationObjectProps;
        volumeObject: VolumeObjectProps;
        volumeGroup: VolumeGroupProps;
    }
}

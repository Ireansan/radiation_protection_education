/**
 * @link https://github.com/pmndrs/react-three-fiber/blob/26cf7eed4f9bddd79305a1f61b20554b07fdff1b/docs/tutorials/typescript.mdx#extend-usage
 */
import { Object3DNode } from "@react-three/fiber";

import { VolumeObject } from "./VolumeObject";
import { VolumeGroup } from "./VolumeGroup";

export type VolumeObjectProps = Object3DNode<VolumeObject, typeof VolumeObject>;
export type VolumeGroupProps = Object3DNode<VolumeGroup, typeof VolumeGroup>;

declare module "@react-three/fiber" {
    interface ThreeElements {
        volumeObject: VolumeObjectProps;
        volumeGroup: VolumeGroupProps;
    }
}

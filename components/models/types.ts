import * as THREE from "three";
import type { objectProps, planesProps } from "../volumeRender";

type modelProps = objectProps & planesProps & JSX.IntrinsicElements["mesh"];

export type { modelProps };

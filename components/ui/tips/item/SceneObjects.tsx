import { TipsItem } from "./TipsItemTemplate";

export function SceneObjectManual({ ...props }) {
    return (
        <>
            <TipsItem>
                <h3>3D Space</h3>
                <p>
                    The controller{" "}
                    <a href="https://github.com/pmndrs/drei#pivotcontrols">
                        PivotControls
                    </a>{" "}
                    is used to manipulate objects in 3D space.
                </p>
                <ul>
                    <li>
                        Drag the left button against an arrow: Move on the
                        selected axis.
                    </li>
                    <li>
                        Drag the left button on a square: move it on the
                        selected plane
                    </li>
                    <li>
                        Drag left button on an arc: Rotate around the selected
                        axis
                    </li>
                </ul>
            </TipsItem>
        </>
    );
}

// FIXME:
export function SceneObjectPlayer({ ...props }) {
    return (
        <>
            <TipsItem
                // FIXME:
                imgSrc={
                    "/img/manual/experiment/01/gif/3D/Player/Move_and_HandIK.gif"
                }
                imgAlt={"gif/Player"}
            >
                <h3>3D Space - Player</h3>
                <p>
                    The amount of exposure is changed by moving the position of{" "}
                    the player and the position of the hand.
                </p>
            </TipsItem>
        </>
    );
}

export function SceneObjectShield({ ...props }) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/gif/3D/Shield/Move.gif"}
                imgAlt={"gif/Shield"}
            >
                <h3>3D Space - Shield</h3>
                <p>
                    Moving the protective plate into the dose distribution{" "}
                    reflects the effect on the dose distribution.
                </p>
                <p>
                    By adjusting the positional relationship between the{" "}
                    protective board and the player, the dosimeter UI displays{" "}
                    an icon indicating the effect of the protective board, and{" "}
                    the exposure dose changes.
                </p>
            </TipsItem>
        </>
    );
}

export function SceneObjectClip1({ ...props }) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/gif/3D/Clip/FreeAxis.gif"}
                imgAlt={"gif/Clip/FreeAxis"}
            >
                <h3>3D Space - Clip (1/2)</h3>
                <p>
                    The clipping plane activated by <code>Clip</code> in the{" "}
                    operation panel is displayed in 3D space and can be{" "}
                    manipulated. A red frame is displayed around the section of{" "}
                    the clipping plane.
                </p>
            </TipsItem>
        </>
    );
}

// FIXME:
export function SceneObjectClip2({ ...props }) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/png/3D/Clip/X_and_Z.png"}
                imgAlt={"img/3D/Clip"}
            >
                <h3>3D Space - Clip (2/2)</h3>
                <p>
                    For all enabled planes, the part of the image for which{" "}
                    clipping is valid will be clipped. For example, if X and Z{" "}
                    are enabled, the result will be as shown below.
                    {/* FIXME: below --> right? */}
                </p>
            </TipsItem>
        </>
    );
}

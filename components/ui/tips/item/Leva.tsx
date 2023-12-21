import { applyBasePath } from "../../../../utils";
import { TipsItem } from "./TipsItemTemplate";

import style from "../../../../styles/css/tips.module.css";

export function LevaDataClip({ ...props }) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/png/leva/Data/Clip.png"}
                imgAlt={"img/leva/Data/Clip"}
            >
                <h3>Data/Clip</h3>
                <p>
                    You can enable or disable each of the four clipping planes:
                    the three clipping planes perpendicular to the X, Y, and Z
                    axes, and the clipping planes whose position and orientation
                    can be freely changed.
                </p>
                <p>
                    The orientation of each clipping plane can also be reversed.
                </p>
            </TipsItem>
        </>
    );
}

import { TipsItem } from "../TipsItemTemplate";

export function LevaDataMode({ ...props }) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/png/leva/Data/mode.png"}
                imgAlt={"img/leva/Data/mode"}
            >
                <h3>Operation panel - Data/mode</h3>
                <p>
                    Two data display formats can be set: time lapse data (`time{" "}
                    lapse`) and cumulative data (`accumulate`).
                </p>
            </TipsItem>
        </>
    );
}

export function LevaDataAnimation({ ...props }) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/png/leva/Data/Animation.png"}
                imgAlt={"img/leva/Data/Animation"}
            >
                <h3>Operation panel - Data/mode</h3>
                <p>
                    When the data display format is `time lapse`, animation can{" "}
                    be manipulated.
                </p>
            </TipsItem>
        </>
    );
}

export function LevaDataClip({ ...props }) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/png/leva/Data/Clip.png"}
                imgAlt={"img/leva/Data/Clip"}
            >
                <h3>Operation panel - Data/Clip</h3>
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

// FIXME:
export function LevaDataDetail({ ...props }) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/png/leva/Data/Clip.png"}
                imgAlt={"img/leva/Data/Clip"}
            >
                <h3>Operation panel - Data/Clip</h3>
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

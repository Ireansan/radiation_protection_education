import { TipsItem } from "./TipsItemTemplate";

// FIXME:
export function CanvasPlayer({ ...props }) {
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

// FIXME:
export function CanvasShield({ ...props }) {
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

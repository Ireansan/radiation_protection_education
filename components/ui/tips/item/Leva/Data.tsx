import { TipsItem } from "../TipsItemTemplate";
import type { TipsBaseProps } from "../TipsItemTemplate";

export function LevaDataMode({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/png/leva/Data/mode.png"}
                imgAlt={"img/leva/Data/mode"}
            >
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Operation panel - Data/mode</h3>
                        <p>
                            Two data display formats can be set: time lapse data
                            (<code>time lapse</code>) and cumulative data (
                            <code>accumulate</code>).
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

// FIXME:
export function LevaDataAnimation({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/png/leva/Data/Animation.png"}
                imgAlt={"img/leva/Data/Animation"}
            >
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Operation panel - Data/Animation</h3>
                        <p>
                            {/* FIXME: */}
                            When the data display format is{" "}
                            <code>time lapse</code>, animation can be
                            manipulated.
                        </p>
                        <ul>
                            <li>
                                <code>play</code>: play / stop
                            </li>
                            <li>
                                <code>speed</code>: playback speed (selectable
                                from
                                <code>0.25</code>, <code>0.5</code>,{" "}
                                <code>1</code>, <code>1.5</code>, <code>2</code>
                                , <code>8</code>, <code>16</code>)
                            </li>
                            <li>
                                <code>time</code>: playback position
                            </li>
                        </ul>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function LevaDataClip({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/png/leva/Data/Clip.png"}
                imgAlt={"img/leva/Data/Clip"}
            >
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Operation panel - Data/Clip</h3>
                        <p>
                            You can enable or disable each of the four clipping
                            planes: the three clipping planes perpendicular to
                            the X, Y, and Z axes, and the clipping planes whose
                            position and orientation can be freely changed.
                        </p>
                        <p>
                            The orientation of each clipping plane can also be
                            reversed.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

// FIXME:
export function LevaDataDetail({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                // FIXME:
                imgSrc={"/img/manual/experiment/01/png/leva/Data/Parameter.png"}
                imgAlt={"img/leva/Data/Detail"}
            >
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Operation panel - Data/Detail</h3>
                        <p>
                            You can set values related to the plotting of dose{" "}
                            distribution data.
                        </p>
                        <ul>
                            <li>
                                <code>opacity</code>: opacity
                            </li>
                            <li>
                                {/* FIXME: */}
                                <code>clim</code>: clim
                            </li>
                            <li>
                                <code>colormap</code>: colormap to be applied to
                                the data
                            </li>
                            <li>
                                <code>renderstyle</code>: the rendering style
                                (you can choose between <code>mip</code>{" "}
                                (Maximum Intensity Projection) and
                                <code>iso</code> (Isosurface))
                            </li>
                            <li>
                                <code>isothreshold</code>: the lower threshold
                                to be rendered (this is reflected only when{" "}
                                <code>renderstyle</code> is
                                <code>iso</code>).
                            </li>
                        </ul>
                        <p>
                            Please refer to{" "}
                            <a href="https://github.com/yuki-koyama/tinycolormap">
                                this link
                            </a>{" "}
                            for the type of color map.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

import { TipsItem } from "../../utils";
import type { TipsBaseProps } from "../../utils";

export function LevaDataMode({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/png/leva/Data/mode.png"}
                imgAlt={"img/leva/Data/mode"}
            >
                {!isEnglish ? (
                    <>
                        <h3>操作パネル - Data/mode</h3>
                        <p>
                            時間経過データ(<code>time lapse</code>)と累積データ(
                            <code>accumulate</code>
                            )の2つのデータ表示形式を設定できます。
                        </p>
                    </>
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

export function LevaDataAnimation({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                // FIXME: img
                imgSrc={"/img/manual/experiment/01/png/leva/Data/Animation.png"}
                imgAlt={"img/leva/Data/Animation"}
            >
                {!isEnglish ? (
                    <>
                        <h3>操作パネル - Data/Animation</h3>
                        <p>
                            データ表示形式が<code>time lapse</code>
                            の時，アニメーションを操作できます。
                        </p>
                        <ul>
                            <li>
                                <code>play</code>：再生・停止
                            </li>
                            <li>
                                <code>speed</code>：再生速度（
                                <code>0.25</code>, <code>0.5</code>,{" "}
                                <code>1</code>, <code>1.5</code>, <code>2</code>
                                , <code>8</code>, <code>16</code>
                                から選択できます）
                            </li>
                            <li>
                                <code>time</code>：再生位置
                            </li>
                        </ul>
                    </>
                ) : (
                    <>
                        <h3>Operation panel - Data/Animation</h3>
                        <p>
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
                    <>
                        <h3>操作パネル - Data/Clip</h3>
                        <p>
                            X, Y,
                            Z軸に垂直なクリッピング平面3つと，自由に位置・向きを変更できるクリッピング平面の4つについて，それぞれ有効にするか操作ができます。
                        </p>
                        <p>
                            また，それぞれのクリッピング平面の向きを反転させることもできます。
                        </p>
                    </>
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

export function LevaDataDetail({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                // FIXME: img
                imgSrc={"/img/manual/experiment/01/png/leva/Data/Parameter.png"}
                imgAlt={"img/leva/Data/Detail"}
            >
                {!isEnglish ? (
                    <>
                        <h3>操作パネル - Data/Detail</h3>
                        <p>線量分布データの描画に関係する値を設定できます。</p>
                        <ul>
                            <li>
                                <code>opacity</code>：不透明度
                            </li>
                            <li>
                                <code>clim</code>：カラーマップの範囲
                                (小数点第二位以下は数値として表示されません)
                            </li>
                            <li>
                                <code>colormap</code>
                                ：データに適用されるカラーマップ
                            </li>
                            <li>
                                <code>renderstyle</code>
                                ：描画形式（<code>mip</code>（Maximuｍ Intensity
                                Projection, 最大値投影），<code>iso</code>
                                （Isosurface, 等値面）が選択できます）
                            </li>
                            <li>
                                <code>isothreshold</code>
                                ：描画される下限の閾値（<code>renderstyle</code>
                                が<code>iso</code>の時のみ反映されます）
                            </li>
                        </ul>
                        <p>
                            カラーマップの種類は
                            <a href="https://github.com/yuki-koyama/tinycolormap">
                                こちらのリンク
                            </a>
                            を参照してください。
                        </p>
                    </>
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
                                <code>clim</code>: colormap range (Any decimal
                                places are not displayed as numerical values)
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

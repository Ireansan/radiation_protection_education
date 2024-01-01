import { TipsItem } from "../utils";
import type { TipsBaseProps } from "../utils";

export function SceneObjectManual({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={<>{!isEnglish ? <h3>3D空間</h3> : <h3>3D Space</h3>}</>}
            >
                {!isEnglish ? (
                    <>
                        <p>
                            3D空間内でのオブジェクトの操作には
                            <a href="https://github.com/pmndrs/drei#pivotcontrols">
                                PivotControls
                            </a>{" "}
                            というコントローラーを採用しています。
                        </p>
                        <ul>
                            <li>
                                矢印に対して左ボタンをドラッグ：選択した軸上を移動
                            </li>
                            <li>
                                四角に対して左ボタンをドラッグ：選択した平面上を移動
                            </li>
                            <li>
                                弧に対して左ボタンをドラッグ：選択した軸周りに回転
                            </li>
                        </ul>
                    </>
                ) : (
                    <>
                        <p>
                            The controller{" "}
                            <a href="https://github.com/pmndrs/drei#pivotcontrols">
                                PivotControls
                            </a>{" "}
                            is used to manipulate objects in 3D space.
                        </p>
                        <ul>
                            <li>
                                Drag the left button against an arrow: Move on
                                the selected axis.
                            </li>
                            <li>
                                Drag the left button on a square: move it on the
                                selected plane
                            </li>
                            <li>
                                Drag left button on an arc: Rotate around the
                                selected axis
                            </li>
                        </ul>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function SceneObjectPlayer({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={
                    <>
                        {!isEnglish ? (
                            <h3>3D空間 - Player</h3>
                        ) : (
                            <h3>3D Space - Player</h3>
                        )}
                    </>
                }
                imgSrc={"/img/manual/tips/gif/3D/Player/Move.gif"}
                imgAlt={"gif/3D/Player"}
            >
                {!isEnglish ? (
                    <>
                        <p>
                            プレイヤーの位置，手の位置を移動させることで，被ばく量が変化します。
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            The amount of exposure is changed by moving the
                            position of the player and the position of the hand.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function SceneObjectShield({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={
                    <>
                        {!isEnglish ? (
                            <h3>3D空間 - Shield</h3>
                        ) : (
                            <h3>3D Space - Shield</h3>
                        )}
                    </>
                }
                imgSrc={"/img/manual/tips/gif/3D/Shield/Move.gif"}
                imgAlt={"gif/3D/Shield"}
            >
                {!isEnglish ? (
                    <>
                        <p>
                            防護板を線量分布内に移動させることで，線量分布に影響が反映されます。
                        </p>
                        <p>
                            また，防護板とプレイヤーの位置関係を調整することで，線量計UIに防護板の影響を示すアイコンが表示され，被ばく量が変化します。
                        </p>
                        <p>
                            防護板のサイズはW57&times;D2&times;H37(cm)で固定となっています。
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            Moving the protective plate into the dose
                            distribution reflects the effect on the dose
                            distribution.
                        </p>
                        <p>
                            By adjusting the positional relationship between the{" "}
                            protective board and the player, the dosimeter UI
                            displays an icon indicating the effect of the
                            protective board, and the exposure dose changes.
                        </p>
                        <p>
                            The size of the protective board is
                            W57&times;D2&times;H37(cm) and is fixed.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function SceneObjectClip1({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={
                    <>
                        {!isEnglish ? (
                            <h3>3D空間 - Clip (1/2)</h3>
                        ) : (
                            <h3>3D Space - Clip (1/2)</h3>
                        )}
                    </>
                }
                imgSrc={"/img/manual/tips/gif/3D/Clip/FreeAxis.gif"}
                imgAlt={"gif/Clip/FreeAxis"}
            >
                {!isEnglish ? (
                    <>
                        <p>
                            操作パネル内の<code>Clip</code>
                            で有効にしたクリッピング平面が3D空間内に表示され，操作が可能になります。
                        </p>
                        <p>
                            クリッピングの断面となる部分には赤い枠が表示されます。
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            The clipping plane activated by <code>Clip</code> in
                            the operation panel is displayed in 3D space and can
                            be manipulated.
                        </p>
                        <p>
                            A red frame is displayed around the section of the
                            clipping plane.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function SceneObjectClip2({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={
                    <>
                        {!isEnglish ? (
                            <h3>3D空間 - Clip (2/2)</h3>
                        ) : (
                            <h3>3D Space - Clip (2/2)</h3>
                        )}
                    </>
                }
                imgSrc={"/img/manual/tips/png/3D/Clip/X_and_Z.png"}
                imgAlt={"png/3D/Clip"}
            >
                {!isEnglish ? (
                    <>
                        <p>
                            有効にした全ての平面に対してクリッピングが成り立つ部分がクリッピングされます。
                        </p>
                        <p>
                            例えば，XとZを有効にした場合，右図のような結果になります。
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            For all enabled planes, the part of the image for
                            which clipping is valid will be clipped.
                        </p>
                        <p>
                            For example, if X and Z are enabled, the result will
                            be as shown right.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

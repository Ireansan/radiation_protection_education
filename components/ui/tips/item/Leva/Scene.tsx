import { TipsItem } from "../../utils";
import type { TipsBaseProps } from "../../utils";

export function LevaSceneGimmickXRay({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={
                    <>
                        {!isEnglish ? (
                            <h3>操作パネル - Scene/Gimmick (X-Ray)</h3>
                        ) : (
                            <h3>Operation panel - Scene/Gimmick</h3>
                        )}
                    </>
                }
                imgSrc={"/img/manual/experiment/01/png/All/Gimmick_X-Ray.png"}
                imgAlt={"img/leva/Scene/Gimmick/X-Ray"}
            >
                {!isEnglish ? (
                    <>
                        <p>
                            シーン毎に固有の結果を返す項目と，3D空間内のコントローラーを非表示にする
                            <code>viewing</code>が操作できます。
                        </p>
                        <p>
                            X線検査室では，<code>curtain</code>
                            でカーテンの有無を操作できます。
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            You can manipulate items that return scene-specific
                            results and <code>viewing</code> that hides the
                            controller in 3D space.
                        </p>
                        <p>
                            In the X-Ray room, the <code>curtain</code> can be
                            used to control the presence or absence of a
                            curtain.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function LevaSceneGimmickCArm({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={
                    <>
                        {!isEnglish ? (
                            <h3>操作パネル - Scene/Gimmick (C-Arm)</h3>
                        ) : (
                            <h3>Operation panel - Scene/Gimmick</h3>
                        )}
                    </>
                }
                imgSrc={"/img/manual/experiment/01/png/All/Gimmick_C-Arm.png"}
                imgAlt={"img/leva/Scene/Gimmick/C-Arm"}
            >
                {!isEnglish ? (
                    <>
                        <p>
                            シーン毎に固有の結果を返す項目と，3D空間内のコントローラーを非表示にする
                            <code>viewing</code>が操作できます。
                        </p>
                        <p>
                            Cアームでは，<code>type</code>
                            で患者に対して真上から照射した場合の
                            <code>type 1</code>と，横から照射した場合の
                            <code>type 2</code>に切り替えられます。
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            You can manipulate items that return scene-specific
                            results and <code>viewing</code> that hides the
                            controller in 3D space.
                        </p>
                        <p>
                            In the C-arm, the <code>type</code> can be switched
                            between <code>type 1</code>, when irradiated from
                            directly above the patient, and <code>type 2</code>,
                            when irradiated from the side.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function LevaSceneOptions({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={
                    <>
                        {!isEnglish ? (
                            <h3>操作パネル - Scene/Options</h3>
                        ) : (
                            <h3>Operation panel - Scene/Options</h3>
                        )}
                    </>
                }
                // FIXME: img
                // imgSrc={"/img/manual/experiment/01/png/leva/Data/Clip.png"}
                imgAlt={"img/leva/Data/Clip"}
            >
                {!isEnglish ? (
                    <>
                        <p>
                            カメラ操作と線量計UIについて、詳細な設定を変更できます。
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            You can change detailed settings for camera
                            controller and dosimeter UI.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function LevaSceneOptionsCameraControlsSettings({
    isEnglish = false,
}: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={
                    <>
                        {!isEnglish ? (
                            <h3>
                                操作パネル - Scene/Options/Camera Controls
                                Settings
                            </h3>
                        ) : (
                            <h3>
                                Operation panel - Scene/Options/Camera Controls
                                Settings
                            </h3>
                        )}
                    </>
                }
                // FIXME: img
                // imgSrc={"/img/manual/experiment/01/png/leva/Data/Clip.png"}
                imgAlt={"img/leva/Scene/Options/CameraControlsSettings"}
            >
                {!isEnglish ? (
                    <>
                        <p>
                            カメラ操作に関連する以下の項目について，設定を変更できます。
                        </p>
                        <ul>
                            <li>
                                <code>dampingFactor</code>
                                ：慣性が有効な時のみ影響する，減衰係数。
                            </li>
                            <li>
                                <code>enableDamping</code>
                                ：慣性の切り替え。デフォルトはoff。
                            </li>
                            <li>
                                <code>panSpeed</code>：移動の速度
                            </li>
                            <li>
                                <code>rotateSpeed</code>：回転の速度
                            </li>
                            <li>
                                <code>zoomSpeed</code>：ズームの速度
                            </li>
                        </ul>
                    </>
                ) : (
                    <>
                        <p>
                            You can change the settings for the following items
                            related to camera controller.
                        </p>
                        <ul>
                            <li>
                                <code>dampingFactor</code>: Damping factor,
                                which affects only when inertia is in effect.
                            </li>
                            <li>
                                <code>enableDamping</code>: Toggle inertia.
                                Default is off.
                            </li>
                            <li>
                                <code>panSpeed</code>: Speed of pan.
                            </li>
                            <li>
                                <code>rotateSpeed</code>: Speed of rotate.
                            </li>
                            <li>
                                <code>zoomSpeed</code>: Speed of zoom.
                            </li>
                        </ul>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function LevaSceneOptionsDosimeterSettingsParameter({
    isEnglish = false,
}: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={
                    <>
                        {!isEnglish ? (
                            <h3>
                                操作パネル - Scene/Options/Dosimeter
                                Settings/Parameter
                            </h3>
                        ) : (
                            <h3>
                                Operation panel - Scene/Options/Dosimeter
                                Settings/Parameter
                            </h3>
                        )}
                    </>
                }
                // FIXME: img
                // imgSrc={"/img/manual/experiment/01/png/leva/Data/Clip.png"}
                imgAlt={"img/leva/Scene/DosimeterSettings"}
            >
                {!isEnglish ? (
                    <>
                        <p>
                            線量計UIの表示と，被ばく量の計算に関係する値の設定ができます。
                        </p>
                        <ul>
                            <li>
                                <code>N (/patient)</code>：
                                患者一人に対して行う照射回数
                            </li>
                            <li>
                                <code>N (/year)</code>：
                                年間に実施を予定している処置回数
                            </li>
                            <li>
                                <code>Limit (/once)</code>：
                                一回の処置での目標上限線量
                            </li>
                        </ul>
                        <p>
                            年間の被ばく量は
                            <code>N (/patient) * N (/year)</code>
                            ，一回の被ばく量は<code>N (/patient)</code>
                            で計算されます。
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            You can display the dosimeter UI and set values
                            related to the calculation of the exposure dose.
                        </p>
                        <ul>
                            <li>
                                <code>N (/patient)</code>: Number of
                                irradiations to be performed on one patient.
                            </li>
                            <li>
                                <code>N (/year)</code>: Number of procedures
                                planned to be performed per year.
                            </li>
                            <li>
                                <code>Limit (/once)</code>: Target upper dose
                                limit per treatment.
                            </li>
                        </ul>
                        <p>
                            The annual exposure dose is calculated as{" "}
                            <code>N (/patient) * N (/year)</code> and the
                            one-time exposure dose as <code>N (/patient)</code>.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function LevaSceneOptionsDosimeterSettingsLayout({
    isEnglish = false,
}: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={
                    <>
                        {!isEnglish ? (
                            <h3>
                                操作パネル - Scene/Options/Dosimeter
                                Settings/Layout
                            </h3>
                        ) : (
                            <h3>
                                Operation panel - Scene/Options/Dosimeter
                                Settings/Layout
                            </h3>
                        )}
                    </>
                }
                // FIXME: img
                // imgSrc={"/img/manual/experiment/01/png/leva/Data/Clip.png"}
                imgAlt={"img/leva/Scene/DosimeterSettings"}
            >
                {!isEnglish ? (
                    <>
                        <p>線量計UIの表示設定を変更できます。</p>
                        <ul>
                            <li>
                                <code>order</code>：年間と一回の値の並び順
                                {/* デフォルトの<code>Year-Once</code>
                                では年間の値が左、一回の値が右の順番に並びます。 */}
                            </li>
                            <li>
                                <code>data</code>：被ばく量の表現方法
                            </li>
                        </ul>
                    </>
                ) : (
                    <>
                        <p>
                            You can change the display settings of the
                            Dosimeter.
                        </p>
                        <ul>
                            <li>
                                <code>order</code>: order of Year and Once
                                values
                                {/* デフォルトの<code>Year-Once</code>
                                では年間の値が左、一回の値が右の順番に並びます。 */}
                            </li>
                            <li>
                                <code>data</code>: expression of exposure dose
                            </li>
                        </ul>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function LevaSceneOptionsDosimeterSettingsLayoutData({
    isEnglish = false,
}: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={
                    <>
                        {!isEnglish ? (
                            <h3>
                                操作パネル - Scene/Options/Dosimeter
                                Settings/Layout/data
                            </h3>
                        ) : (
                            <h3>
                                Operation panel - Scene/Options/Dosimeter
                                Settings/Layout/data
                            </h3>
                        )}
                    </>
                }
                // FIXME: img
                // imgSrc={"/img/manual/experiment/01/png/leva/Data/Clip.png"}
                imgAlt={"img/leva/Scene/DosimeterSettings"}
            >
                {!isEnglish ? (
                    <>
                        <p>
                            表現方法が<code>addition</code>
                            の場合，被ばく量がそのまま表示され，白いバーが伸びていきます。
                        </p>
                        <p>
                            <code>subtraction</code>
                            ではそれぞれの規制量から被ばく量を引いた値が表示され，緑色のバーが削れていき，黄色のバー（被ばく量）が表示されていきます。
                            <br />
                            被ばく量が規制量を超えた場合，マイナスの値が表示されます。
                        </p>
                        <p>
                            どちらの表現方法でも規制量を超過した場合，数値とバーの色が赤色に変わります。
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            If the expression method is <code>addition</code>,
                            the exposure dose is displayed as it is, and the
                            white bar extends.
                        </p>
                        <p>
                            In <code>subtraction</code>, the exposure dose is
                            subtracted from the respective regulated dose, and
                            the green bar is shaved off, and the yellow bar
                            (exposure dose) is displayed.
                            <br />
                            If the exposure dose exceeds the regulation dose, a
                            negative value is displayed.
                        </p>
                        <p>
                            When the regulation amount is exceeded in either
                            representation, the color of the value and the bar
                            changes to red.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

import { TipsItem } from "../TipsItemTemplate";
import type { TipsBaseProps } from "../TipsItemTemplate";

export function LevaSceneGimmickXRay({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/png/All/Gimmick_X-Ray.png"}
                imgAlt={"img/leva/Scene/Gimmick/X-Ray"}
            >
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Operation panel - Scene/Gimmick</h3>
                        <p>
                            You can manipulate items that return scene-specific
                            results and <code>viewing</code> that hides the
                            controller in 3D space.
                        </p>
                        <p>
                            In the x-ray room, the <code>curtain</code> can be
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
                imgSrc={"/img/manual/experiment/01/png/All/Gimmick_C-Arm.png"}
                imgAlt={"img/leva/Scene/Gimmick/C-Arm"}
            >
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Operation panel - Scene/Gimmick</h3>
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

// FIXME:
export function LevaSceneOptions({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                // imgSrc={"/img/manual/experiment/01/png/leva/Data/Clip.png"}
                imgAlt={"img/leva/Data/Clip"}
            >
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Operation panel - Scene/Options</h3>
                        <p></p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

// FIXME:
export function LevaSceneOptionsCameraControlsSettings({
    isEnglish = false,
}: TipsBaseProps) {
    return (
        <>
            <TipsItem
                // imgSrc={"/img/manual/experiment/01/png/leva/Data/Clip.png"}
                imgAlt={"img/leva/Scene/Options/CameraControlsSettings"}
            >
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>
                            Operation panel - Scene/Options/Camera Controls
                            Settings
                        </h3>
                        <p></p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

// FIXME:
export function LevaSceneOptionsDosimeterSettings({
    isEnglish = false,
}: TipsBaseProps) {
    return (
        <>
            <TipsItem
                // imgSrc={"/img/manual/experiment/01/png/leva/Data/Clip.png"}
                imgAlt={"img/leva/Scene/DosimeterSettings"}
            >
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Operation panel - Scene/Dosimeter Settings</h3>
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

import { TipsItem } from "../../utils";
import type { TipsBaseProps } from "../../utils";

export function LevaPlayerEquipments({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={
                    <>
                        {!isEnglish ? (
                            <h3>操作パネル - Player/Equipments</h3>
                        ) : (
                            <h3>Operation panel - Player/Equipments</h3>
                        )}
                    </>
                }
                imgSrc={"/img/manual/tips/png/leva/Player/Equipments.png"}
                imgAlt={"png/leva/Player/Equipments"}
            >
                {!isEnglish ? (
                    <>
                        <p>放射線防護具の装備の有無を選択できます。</p>
                        <p>
                            装備を有効にすることで，線量計UIに種類に応じたアイコンと防護具の3Dモデルが表示され，被ばく量が変化します。
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            You can select whether or not you are equipped with{" "}
                            radiation protection equipment.
                        </p>
                        <p>
                            By activating the equipment, the dosimeter UI
                            displays icons and 3D models of the protective
                            equipment according to the type and the exposure
                            dose.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function LevaPlayerHands({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                title={
                    <>
                        {!isEnglish ? (
                            <h3>操作パネル - Player/Hands</h3>
                        ) : (
                            <h3>Operation panel - Player/Hands</h3>
                        )}
                    </>
                }
                imgSrc={"/img/manual/tips/gif/leva/Player/Hands.gif"}
                imgAlt={"gif/leva/Player/Hands"}
            >
                {!isEnglish ? (
                    <>
                        <p>
                            数値の左にある部分をクリックしながら移動させるか，数値を入力することで，手の位置を変更できます。
                        </p>
                        <p>
                            右に移動させると手を前に，左に移動させると後ろに，上に移動させると上に，下に移動させると下に移動します。
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            You can change the position of the hand by clicking
                            and moving the area to the left of the number or by
                            entering a numerical value.
                        </p>
                        <p>
                            Moving it to the right moves the hand forward,
                            moving it to the left moves it backward, moving it
                            up moves it up, and moving it down moves it down.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

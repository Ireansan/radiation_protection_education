import { TipsItem } from "../../utils";
import type { TipsBaseProps } from "../../utils";

export function LevaPlayerEquipments({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                imgSrc={
                    "/img/manual/experiment/01/png/leva/Player/Equipments.png"
                }
                imgAlt={"img/leva/Player/Equipments"}
            >
                {!isEnglish ? (
                    <>
                        <h3>操作パネル - Player/Equipments</h3>
                        <p>放射線防護具の装備の有無を選択できます。</p>
                        <p>
                            装備を有効にすることで，線量計UIに種類に応じたアイコンが表示され，被ばく量が変化します。
                        </p>
                    </>
                ) : (
                    <>
                        <h3>Operation panel - Player/Equipments</h3>
                        <p>
                            You can select whether or not you are equipped with{" "}
                            radiation protection equipment.
                        </p>
                        <p>
                            By activating the equipment, the dosimeter UI
                            displays icons according to the type and the
                            exposure dose.
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
                // FIXME: gif
                // imgSrc={
                //     "/img/manual/experiment/01/png/leva/Player/Equipments.png"
                // }
                imgAlt={"img/leva/Player/Hands"}
            >
                {!isEnglish ? (
                    <>
                        <h3>操作パネル - Player/Hands</h3>
                        <p>
                            数値の左にある部分をクリックしながら移動させることで，手の位置を変更できます。
                        </p>
                        <p>
                            右に移動させると手を前に，左に移動させると後ろに，上に移動させると上に，下に移動させると下に移動します。
                        </p>
                    </>
                ) : (
                    <>
                        <h3>Operation panel - Player/Hands</h3>
                        <p>
                            The position of the hand can be changed by clicking
                            and moving the area to the left of the numerical
                            value.
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

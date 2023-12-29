import React, { memo, useMemo, useEffect } from "react";
import { QuestionMark } from "@mui/icons-material";

import { useStore } from "../../../store";
import { Item, SubItem, NextButton } from "../utils";
import type { ScenarioProps } from "../utils";

import style from "../../../../styles/css/exercise.module.css";

const MemoItem = memo(Item);
const MemoSubItem = memo(SubItem);

/**
 *
 */
export type Tutorial1Props = {
    sceneName: string;
} & ScenarioProps;
export function Tutorial1({ isEnglish = false, sceneName }: Tutorial1Props) {
    const [set, exerciseProgress, executeLog] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
        state.sceneStates.executeLog,
    ]);

    const [tips, openAndClose] = useMemo(() => {
        const tips = Object.values(executeLog.tips);
        const openAndClose = tips.reduce(
            (previous, current) => previous && current
        );

        return [tips, openAndClose];
    }, [executeLog]);

    const [gimmick, allCheck] = useMemo(() => {
        const gimmickXRay = Object.values(executeLog.gimmick.xRay);
        const allCheckXRay = gimmickXRay.reduce(
            (previous, current) => previous && current
        );

        const gimmickCArm = Object.values(executeLog.gimmick.cArm);
        const allCheckCArm = gimmickCArm.reduce(
            (previous, current) => previous && current
        );

        const gimmick = sceneName === "X-Ray" ? gimmickXRay : gimmickCArm;
        const allCheck = sceneName === "X-Ray" ? allCheckXRay : allCheckCArm;

        return [gimmick, allCheck];
    }, [executeLog, sceneName]);

    useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                exerciseProgress: {
                    ...state.sceneStates.exerciseProgress,
                    tutorial1: openAndClose && allCheck,
                },
            },
        }));
    }, [openAndClose, allCheck]);

    return (
        <>
            <div className={`${style.content}`}>
                <h3>Tutorial (1/4)</h3>
                <div className={`${style.items}`}>
                    <MemoItem isDone={openAndClose}>
                        {!isEnglish ? (
                            <>
                                画面左上の
                                <span
                                    style={{
                                        backgroundColor: "#007aff",
                                        borderRadius: "1px",
                                    }}
                                >
                                    <QuestionMark sx={{ fontSize: "1em" }} />
                                </span>
                                をクリックし、
                                <br />
                                Tipsが表示されることを確認する
                            </>
                        ) : (
                            <></>
                        )}
                    </MemoItem>
                    <MemoItem isDone={allCheck}>
                        {!isEnglish ? <>Gimmickのtypeを全て確認する</> : <></>}
                        <MemoSubItem isDone={allCheck}>
                            type: {gimmick.filter((v) => v === true).length}/
                            {gimmick.length}
                        </MemoSubItem>
                    </MemoItem>
                </div>
                <NextButton disabled={!exerciseProgress.tutorial1} />
            </div>
        </>
    );
}

/**
 *
 */
export function Tutorial2({ isEnglish = false }: ScenarioProps) {
    const [set, exerciseProgress, executeLog] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
        state.sceneStates.executeLog,
    ]);

    const [equipments, allEquipped] = useMemo(() => {
        const equipments = Object.values(executeLog.dosimeter);
        const allEquipped = equipments.reduce(
            (previous, current) => previous && current
        );

        return [equipments, allEquipped];
    }, [executeLog]);

    const [hands, allHandMoved] = useMemo(() => {
        const hands = [executeLog.player.leftHand, executeLog.player.rightHand];
        const allHandMoved = hands.reduce(
            (previous, current) => previous && current
        );

        return [hands, allHandMoved];
    }, [executeLog]);

    useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                exerciseProgress: {
                    ...state.sceneStates.exerciseProgress,
                    tutorial2: allEquipped && allHandMoved,
                },
            },
        }));
    }, [allEquipped, allHandMoved]);

    return (
        <>
            <div className={`${style.content}`}>
                <h3>Tutorial (2/4)</h3>
                <div className={`${style.items}`}>
                    <MemoItem isDone={allEquipped}>
                        {!isEnglish ? (
                            <>プレイヤーの装備を全て有効にする</>
                        ) : (
                            <></>
                        )}
                        <MemoSubItem isDone={allEquipped}>
                            (Optional){" "}
                            {!isEnglish ? (
                                <>線量計UIと3Dモデルの変化を確認する</>
                            ) : (
                                <></>
                            )}
                        </MemoSubItem>
                    </MemoItem>
                    <MemoItem isDone={allHandMoved}>
                        {!isEnglish ? <>プレイヤーの手の位置を変える</> : <></>}
                    </MemoItem>
                </div>
                <NextButton disabled={!exerciseProgress.tutorial2} />
            </div>
        </>
    );
}
/**
 *
 */
export function Tutorial3({ isEnglish = false }: ScenarioProps) {
    const [set, exerciseProgress, executeLog] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
        state.sceneStates.executeLog,
    ]);

    const [modes, allCheckMode] = useMemo(() => {
        const modes = Object.values(executeLog.animation);
        const allCheckMode = modes.reduce(
            (previous, current) => previous && current
        );

        return [modes, allCheckMode];
    }, [executeLog]);

    const [clipping, checkClip] = useMemo(() => {
        const clipping = Object.values(executeLog.clipping);
        const checkClip = clipping.reduce(
            (previous, current) => previous || current
        );

        return [clipping, checkClip];
    }, [executeLog]);

    const [parameter, checkParameter] = useMemo(() => {
        const colormap = Object.values(executeLog.parameter.colormap);
        const renderStyle = Object.values(executeLog.parameter.renderStyle);
        const parameter = [...colormap, ...renderStyle];
        const checkParameter = parameter.filter((value) => value).length > 3;

        return [parameter, checkParameter];
    }, [executeLog]);

    useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                exerciseProgress: {
                    ...state.sceneStates.exerciseProgress,
                    tutorial3: allCheckMode,
                },
            },
        }));
    }, [allCheckMode]);

    return (
        <>
            <div className={`${style.content}`}>
                <h3>Tutorial (3/4)</h3>
                <div className={`${style.items}`}>
                    <MemoItem isDone={allCheckMode}>
                        {!isEnglish ? <>Dataのmodeを変える</> : <></>}
                    </MemoItem>
                    <MemoItem isDone={checkClip}>
                        (Optional){" "}
                        {!isEnglish ? <>Clipを操作し、断面を確認する</> : <></>}
                    </MemoItem>
                    <MemoItem isDone={checkParameter}>
                        (Optional){" "}
                        {!isEnglish ? (
                            <>Detailでcolormap, renderstyle などの変更を行う</>
                        ) : (
                            <></>
                        )}
                    </MemoItem>
                </div>
                <NextButton disabled={!exerciseProgress.tutorial3} />
            </div>
        </>
    );
}

/**
 *
 */
export function Tutorial4({ isEnglish = false }: ScenarioProps) {
    const [set, exerciseProgress, executeLog] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
        state.sceneStates.executeLog,
    ]);

    const [playerMoved] = useMemo(() => {
        const playerMoved = executeLog.player.translate;

        return [playerMoved];
    }, [executeLog]);

    const [shieldMoved, shieldEnabled] = useMemo(() => {
        const shieldMoved = executeLog.shield.translate;
        const shieldEnabled = executeLog.shield.enabled;

        return [shieldMoved, shieldEnabled];
    }, [executeLog]);

    useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                exerciseProgress: {
                    ...state.sceneStates.exerciseProgress,
                    tutorial4: playerMoved && shieldMoved && shieldEnabled,
                },
            },
        }));
    }, [playerMoved, shieldMoved, shieldEnabled]);

    return (
        <>
            <div className={`${style.content}`}>
                <h3>Tutorial (4/4)</h3>
                <div className={`${style.items}`}>
                    <MemoItem isDone={playerMoved}>
                        {!isEnglish ? <>プレイヤーを移動させる</> : <></>}
                    </MemoItem>
                    <MemoItem isDone={shieldMoved && shieldEnabled}>
                        {!isEnglish ? (
                            <>防護板を線量分布内に移動させる</>
                        ) : (
                            <></>
                        )}
                        <MemoSubItem>
                            {!isEnglish ? (
                                <>
                                    注意:
                                    処理が重くなる恐れがあります。現在使用しているデバイスで操作が困難になった場合、GPUを搭載しているデバイスで実施して下さい。
                                </>
                            ) : (
                                <></>
                            )}
                        </MemoSubItem>
                    </MemoItem>
                </div>
                <NextButton disabled={!exerciseProgress.tutorial4} />
            </div>
        </>
    );
}

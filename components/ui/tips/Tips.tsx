import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import { QuestionMark, Close } from "@mui/icons-material";

import { useStore } from "../../../components/store";
import * as ITEM from "./item";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import style from "../../../styles/css/tips.module.css";

/**
 * @link https://swiperjs.com/demos#css-mode
 */
export type TipsProps = { isEnglish?: boolean };
export function Tips({ isEnglish = false }: TipsProps) {
    const [set, tips] = useStore((state) => [state.set, state.tips]);

    return (
        <>
            <button
                className={`${style.tips}`}
                onClick={() => {
                    set({ tips: true });

                    set((state) => ({
                        sceneStates: {
                            ...state.sceneStates,
                            executeLog: {
                                ...state.sceneStates.executeLog,
                                tips: {
                                    ...state.sceneStates.executeLog.tips,
                                    open: true,
                                },
                            },
                        },
                    }));
                }}
            >
                <QuestionMark sx={{ fontSize: 16 }} />
            </button>
            <div
                className={`${style.fullscreen} ${!tips && `${style.close}`}`}
                onClick={() => {
                    set({ tips: false });

                    set((state) => ({
                        sceneStates: {
                            ...state.sceneStates,
                            executeLog: {
                                ...state.sceneStates.executeLog,
                                tips: {
                                    ...state.sceneStates.executeLog.tips,
                                    close: true,
                                },
                            },
                        },
                    }));
                }}
            >
                <div
                    className={style.foundation}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <button
                        className={style.closeButton}
                        onClick={() => {
                            set({ tips: false });

                            set((state) => ({
                                sceneStates: {
                                    ...state.sceneStates,
                                    executeLog: {
                                        ...state.sceneStates.executeLog,
                                        tips: {
                                            ...state.sceneStates.executeLog
                                                .tips,
                                            close: true,
                                        },
                                    },
                                },
                            }));
                        }}
                    >
                        <Close sx={{ fontSize: 16 }} />
                    </button>
                    <Swiper
                        cssMode={true}
                        navigation={true}
                        pagination={true}
                        mousewheel={true}
                        keyboard={true}
                        rewind={true}
                        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                        className={style.swiper}
                    >
                        {/* ================================================== */}
                        {/* Screen */}
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.ScreenStructure isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.Screen3DSpace isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.ScreenOperationPanel isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.ScreenUIDosimeter1 isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.ScreenUIDosimeter2 isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.ScreenUIDosimeter3 isEnglish={isEnglish} />
                        </SwiperSlide>
                        {/* ================================================== */}
                        {/* Scene Object */}
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.SceneObjectManual isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.SceneObjectPlayer isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.SceneObjectShield isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.SceneObjectClip1 isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.SceneObjectClip2 isEnglish={isEnglish} />
                        </SwiperSlide>
                        {/* ================================================== */}
                        {/* Operation Panel */}
                        {/* -------------------------------------------------- */}
                        {/* Leva/Scene */}
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaSceneGimmickXRay isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaSceneGimmickCArm isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaSceneOptions isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaSceneOptionsCameraControlsSettings
                                isEnglish={isEnglish}
                            />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaSceneOptionsDosimeterSettingsParameter
                                isEnglish={isEnglish}
                            />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaSceneOptionsDosimeterSettingsLayout
                                isEnglish={isEnglish}
                            />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaSceneOptionsDosimeterSettingsLayoutData
                                isEnglish={isEnglish}
                            />
                        </SwiperSlide>
                        {/* -------------------------------------------------- */}
                        {/* Leva/Player */}
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaPlayerEquipments isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaPlayerHands isEnglish={isEnglish} />
                        </SwiperSlide>
                        {/* -------------------------------------------------- */}
                        {/* Leva/Data */}
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaDataMode isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaDataAnimation isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaDataClip isEnglish={isEnglish} />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaDataDetail isEnglish={isEnglish} />
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </>
    );
}

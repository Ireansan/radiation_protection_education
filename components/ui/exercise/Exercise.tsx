import React, { useMemo } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

import { useStore } from "../../store";
import * as SCENARIOS from "./scenarios";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import style from "../../../styles/css/exercise.module.css";

export type ExerciseProps = { sceneName: string; isEnglish?: boolean };
export function Exercise({ sceneName, isEnglish = false }: ExerciseProps) {
    const [debug] = useStore((state) => [state.debug]);

    const [execise1Radius, execise2Radius] = useMemo(() => {
        const execise1Radius = sceneName === "X-Ray" ? 0.7 : 1.1;
        const execise2Radius = sceneName === "X-Ray" ? 1.7 : 1.5;

        return [execise1Radius, execise2Radius];
    }, [sceneName]);

    return (
        <>
            <div className={style.foundation}>
                <Swiper
                    navigation={debug}
                    mousewheel={true}
                    modules={[Navigation, Mousewheel]}
                    className={style.swiper}
                >
                    <SwiperSlide className={style.swiperSlide}>
                        <SCENARIOS.Exercise1
                            radius={execise1Radius}
                            isEnglish={isEnglish}
                        />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <SCENARIOS.Exercise2Preparation isEnglish={isEnglish} />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <SCENARIOS.Exercise2
                            radius={execise2Radius}
                            isEnglish={isEnglish}
                        />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <SCENARIOS.Exercise3 isEnglish={isEnglish} />
                    </SwiperSlide>
                </Swiper>
            </div>
        </>
    );
}

import React from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

import { useStore } from "../../store";
import * as SCENARIOS from "./scenarios";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import style from "../../../styles/css/exercise.module.css";

export type ExerciseProps = { isEnglish?: boolean };
export function Exercise({ isEnglish = false }: ExerciseProps) {
    const [debug] = useStore((state) => [state.debug]);

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
                        <SCENARIOS.Exercise1 isEnglish={isEnglish} />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <SCENARIOS.Exercise2Preparation isEnglish={isEnglish} />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <SCENARIOS.Exercise2 isEnglish={isEnglish} />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <SCENARIOS.Exercise3 isEnglish={isEnglish} />
                    </SwiperSlide>
                </Swiper>
            </div>
        </>
    );
}

import React from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

import { useStore } from "../../store";
import * as TUTORIALS from "./scenarios";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import style from "../../../styles/css/exercise.module.css";

export type TutorialProps = { sceneName: string; isEnglish?: boolean };
export function Tutorial({ sceneName, isEnglish = false }: TutorialProps) {
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
                        <TUTORIALS.Tutorial1
                            sceneName={sceneName}
                            isEnglish={isEnglish}
                        />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <TUTORIALS.Tutorial2 isEnglish={isEnglish} />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <TUTORIALS.Tutorial3 isEnglish={isEnglish} />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <TUTORIALS.Tutorial4 isEnglish={isEnglish} />
                    </SwiperSlide>
                </Swiper>
            </div>
        </>
    );
}

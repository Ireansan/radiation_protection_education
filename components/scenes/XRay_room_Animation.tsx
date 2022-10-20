import * as Models from "../models";
import { VolumeRenderAnimation } from "../volumeRender";

function XRayRoomAnimation({ ...props }) {
    const rotation = [0, Math.PI / 2, 0];
    return (
        <>
            <VolumeRenderAnimation>
                <Models.Dose_1 rotation={rotation} clipping={true} />
                <Models.Dose_2 rotation={rotation} clipping={true} />
                <Models.Dose_3 rotation={rotation} clipping={true} />
                <Models.Dose_4 rotation={rotation} clipping={true} />
                <Models.Dose_5 rotation={rotation} clipping={true} />
                <Models.Dose_6 rotation={rotation} clipping={true} />
                <Models.Dose_7 rotation={rotation} clipping={true} />
                <Models.Dose_8 rotation={rotation} clipping={true} />
                <Models.Dose_9 rotation={rotation} clipping={true} />
                <Models.Dose_10 rotation={rotation} clipping={true} />
                <Models.Dose_11 rotation={rotation} clipping={true} />
                <Models.Dose_12 rotation={rotation} clipping={true} />
                <Models.Dose_13 rotation={rotation} clipping={true} />
                <Models.Dose_14 rotation={rotation} clipping={true} />
                <Models.Dose_15 rotation={rotation} clipping={true} />
                <Models.Dose_16 rotation={rotation} clipping={true} />
            </VolumeRenderAnimation>
        </>
    );
}

export default XRayRoomAnimation;

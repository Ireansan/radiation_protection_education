import cv2

import cv2
import numpy as np

def generate_black_mp4(out_path, seconds):
    frame_size = (640, 480)
    fps = 30

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(out_path, fourcc, fps, frame_size, isColor=False)

    for _ in range(int(fps * int(seconds))):
        frame = np.zeros((frame_size[1], frame_size[0]), dtype=np.uint8)
        out.write(frame)

    out.release()

import sys
if __name__ == "__main__":
    args = sys.argv
    generate_black_mp4(*args[1:])

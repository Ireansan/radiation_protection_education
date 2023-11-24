from pydub import AudioSegment

def generate_silence_mp3(out_path, duration):
    silence = AudioSegment.silent(duration=duration * 1000)

    silence.export(out_path, format="mp3")

import sys
if __name__ == "__main__":
    args = sys.argv
    generate_silence_mp3(*args[1:])

import sys
import os
from os import path
import keyboard
import pyaudio
import wave
import math
import time

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
WINDOW_SIZE = 1



def save_speech(data, p, rate, channels):
    """ Saves mic data to temporary WAV file. Returns filename of saved
        file """
    filedir = path.dirname(path.abspath(__file__))
    filename = 'output_'+str(int(time.time()))
    # writes data to WAV file
    data = b''.join(data)
    wf = wave.open(path.join(filedir, filename + '.wav'), 'wb')
    wf.setnchannels(channels)
    wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
    wf.setframerate(rate)
    wf.writeframes(data)
    wf.close()
    return filename + '.wav'

def delete_speech(fn):
    filedir = path.dirname(path.abspath(__file__))
    os.remove(path.join(filedir, fn))
    return True

def listen_to_speech():
    savedFile = False
    audio2send = []
    cur_data = ''  # current chunk  of audio data
    response = []

    print "Waiting for 'v' to be pressed"

    keyboard.wait('v')

    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK
                    )

    print "Recording... (press 'b' to stop)"

    while True:
        cur_data = stream.read(CHUNK)
        audio2send.append(cur_data)
        if keyboard.is_pressed('b'):
            break;

    print "Recording stopped, saving file..."

    filename = save_speech(audio2send, p, RATE, CHANNELS)

    print "File saved"
    print filename

    savedFile = filename

    stream.stop_stream()
    stream.close()
    p.terminate()
    return savedFile

if __name__ == "__main__":
    print listen_to_speech()

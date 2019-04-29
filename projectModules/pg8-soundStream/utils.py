import sys
from os import path
import pyaudio
import math
import audioop

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100

def audio_int(num_samples= 50):
    p = pyaudio.PyAudio()
    
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer = CHUNK)

    values = [math.sqrt(abs(audioop.avg(stream.read(CHUNK),4))) for x in range(num_samples)]
    values = sorted(values, reverse = True)
    r = sum(values[:int(num_samples * 0.2)])/ int(num_samples *0.2)
    print "Avrage intensity" , r
    stream.close()
    p.terminate()
    return r

      
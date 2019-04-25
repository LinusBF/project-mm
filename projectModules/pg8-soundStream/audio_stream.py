import sys
from os import path
import pyaudio
import wave
from utils import audio_int

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
RECORD_SECONDS = 5
THERESHOLD =  audio_int(50)

p = pyaudio.PyAudio()

    audio2send = []
    cur_data = ''  # current chunk  of audio data
    rel = RATE / CHUNK
    slid_win = deque(maxlen=SILENCE_LIMIT * rel)
    # Prepend audio from 0.5 seconds before noise was detected
    prev_audio = deque(maxlen=PREV_AUDIO * rel)
    started = False
    n = num_phrases
    response = []

    while (num_phrases == -1 or n > 0):
        cur_data = stream.read(CHUNK)
        slid_win.append(math.sqrt(abs(audioop.avg(cur_data, 4))))
        #print slid_win[-1]
        if(sum([x > THRESHOLD for x in slid_win]) > 0):
            if(not started):
                print "Starting record of phrase"
                started = True
            audio2send.append(cur_data)
        elif (started is True):
            print "Finished"

frames = []

for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
    data = stream.read(CHUNK)
    frames.append(data)

print("* done recording")

stream.stop_stream()
stream.close()
p.terminate()

import sys
import os 
from collections import deque 
from os import path
import pyaudio
import wave
import math
import time 
import audioop

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
THRESHOLD = 4500
SILENCE_LIMIT = 1
PREV_AUDIO = 0.5



def save_speech(data, p, rate, channels):
    """ Saves mic data to temporary WAV file. Returns filename of saved
        file """
    filename = 'output_'+str(int(time.time()))
    # writes data to WAV file
    data = b''.join(data)
    wf = wave.open(filename + '.wav', 'wb')
    wf.setnchannels(channels)
    wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
    wf.setframerate(rate)
    wf.writeframes(data)
    wf.close()
    return filename + '.wav'

def delete_speech(fn):
    os.remove(fn)

def listen_to_speech(threshold):
    savedFile = False
    global THRESHOLD
    THRESHOLD = threshold +300
    num_phrases = -1
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK
                    )
    audio2send = []
    cur_data = ''  # current chunk  of audio data
    rel = RATE / CHUNK
    slid_win = deque(maxlen=SILENCE_LIMIT * rel)
    # Prepend audio from 0.5 seconds before noise was detected
    prev_audio = deque(maxlen=PREV_AUDIO * rel)
    started = False
    n = num_phrases
    response = []

    print "Found noice floor at " + str(THRESHOLD)

    while num_phrases < 1:
        cur_data = stream.read(CHUNK)
        slid_win.append(math.sqrt(abs(audioop.avg(cur_data, 4))))
        #print slid_win[-1]
        if (sum([x > THRESHOLD for x in slid_win]) > 0):
            if not started:
                print "Starting record of phrase"
                started = True
            audio2send.append(cur_data)
        elif started is True:
            print "Silence reached with intensity of " + str(slid_win[-1])
            filename = save_speech(list(prev_audio) + audio2send, p, RATE, CHANNELS)
            print "Finished"
            savedFile = filename

            #print "Deleting local file"
            #delete_speech(filename)
            #print "File Deleted"
	    num_phrases = 1
            started = False
            slid_win = deque(maxlen=SILENCE_LIMIT * rel)
            prev_audio = deque(maxlen=PREV_AUDIO * rel)
            audio2send = []
            n -= 1
        else:
            prev_audio.append(cur_data)

    print("* done recording")

    stream.stop_stream()
    stream.close()
    p.terminate()
    return savedFile

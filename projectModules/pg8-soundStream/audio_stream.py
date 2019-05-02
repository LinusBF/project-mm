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
SILENCE_LIMIT = 1
PREV_AUDIO = 0.5

p = pyaudio.PyAudio()
stream = p.open(format=FORMAT,
                channels=CHANNELS,
                rate=RATE,
                input=True,
                frames_per_buffer=CHUNK)
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
        filename = save_speech(list(prev_audio) + audio2send, p)
        print "Finished"
        started = False
        slid_win = deque(maxlen=SILENCE_LIMIT * rel)
        prev_audio = deque(maxlen=0.5 * rel)
        audio2send = []
        n -= 1
    else:
        prev_audio.append(cur_data)

frames = []

for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
    data = stream.read(CHUNK)
    frames.append(data)

print("* done recording")

stream.stop_stream()
stream.close()
p.terminate()

def save_speech(data, p):
    """ Saves mic data to temporary WAV file. Returns filename of saved
        file """

    filename = 'output_'+str(int(time.time()))
    # writes data to WAV file
    data = ''.join(data)
    wf = wave.open(filename + '.wav', 'wb')
    wf.setnchannels(1)
    wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
    wf.setframerate(16000)  # TODO make this value a function parameter?
    wf.writeframes(data)
    wf.close()
    return filename + '.wav'
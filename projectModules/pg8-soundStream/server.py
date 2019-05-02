from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import json
import utils
import audio_stream


app = Flask(__name__)
CORS(app)

@app.route("/listen-to-speech", methods = ['POST'])
@cross_origin()
def listen_to_speech():
    intensity = request.get_json()['data'];
    print "In LTS with intensity of " + str(intensity)
    return jsonify({'data': audio_stream.listen_to_speech(intensity)})


@app.route("/get-threshold")
@cross_origin()
def audio_intensity():
    return jsonify({'data': utils.audio_intensity()})


@app.route("/delete-file")
@cross_origin()
def delete_file():
    filename = request.get_json()['filename'];
    return jsonify({'data': audio_stream.delete_speech(filename)})


app.run(port = 5002)

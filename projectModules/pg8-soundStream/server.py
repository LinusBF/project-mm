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
    return jsonify({'data': audio_stream.listen_to_speech()})


@app.route("/delete-file", methods = ['POST'])
@cross_origin()
def delete_file():
    filename = request.get_json()['data']
    return jsonify({'data': audio_stream.delete_speech(filename)})


app.run(port = 5002)

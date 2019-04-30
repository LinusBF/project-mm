from flask import Flask, jsonify request render_template
from flask_cors import CORS, cross_origin
import utils
import audio_stream

app = Flask(__name__)
CORS(app)

@app.route("/listen-to-speech")
@cross_origin()
def listen_to_speech():
    intensity = request.args.get('data');
    return jsonify({'data': audio_stream.listen_to_speech(intensity)})


@app.route("/get-threshold")
@cross_origin()
def audio_intensity():
    return jsonify({'data': utils.audio_intensity()})


app.run(port = 5002)
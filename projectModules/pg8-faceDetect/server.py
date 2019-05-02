from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import face_detect

app = Flask(__name__)
CORS(app)

@app.route("/detect-face")
@cross_origin()
def detect_face():
    return jsonify({'data': face_detect.face_in_frame()})


app.run(port=5001)

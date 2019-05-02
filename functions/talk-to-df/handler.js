'use strict';

const uuid = require('uuid');
const dialogFlow = require("dialogflow");
const waveFile = require("wavefile");

function talkToDF(params) {
    return new Promise((resolve, reject) => {
        const file = params.file || null;
        if (file) {
            const wavFile = new waveFile();
            wavFile.fromBase64(file);
            runSample(file, params.GA_EMAIL, params.GA_KEY)
                .then(res => resolve({
                    headers: {"Content-Type": "application/json"},
                    status: 200,
                    body: JSON.stringify({data: "intent: " + res.fulfillmentText})
                }))
                .catch(err => reject({
                    headers: {"Content-Type": "application/json"},
                    status: 500,
                    body: JSON.stringify({data: `Failed with error: ${err}`})
                }));
        } else {
            resolve({
                headers: {"Content-Type": "application/json"},
                status: 200,
                body: JSON.stringify({data: `No File supplied`})
            });
        }
    });
}

function runSample(buffer, gaEmail, gaKey) {
    return new Promise((resolve, reject) => {
        const encoding = 'AUDIO_ENCODING_LINEAR_16';
        const sampleRateHertz = "44100";
        const languageCode = "en-US";
        // A unique identifier for the given session
        const sessionId = uuid.v4();

        // Create a new session
        const config = {
            credentials: {
                private_key: gaKey,
                client_email: gaEmail,
            }
        };
        const sessionClient = new dialogFlow.SessionsClient(config);
        const sessionPath = sessionClient.sessionPath("magic-mirror-239108", sessionId);

        const request = {
            session: sessionPath,
            queryInput: {
                audioConfig: {
                    audioEncoding: encoding,
                    sampleRateHertz: sampleRateHertz,
                    languageCode: languageCode,
                },
            },
            inputAudio: buffer,
        };

        // Recognizes the speech in the audio and detects its intent.

        sessionClient.detectIntent(request)
            .then(response => {
                resolve(response[0].queryResult);
            })
            .catch(err => reject(err));
    });
}

exports.talkToDF = talkToDF;

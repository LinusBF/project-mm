'use strict';

const uuid = require('uuid');
const dialogFlow = require("dialogflow");
const waveFile = require("wavefile");

function talkToDF(params) {
    return new Promise((resolve, reject) => {
        const file = params.data.soundFile || null;
        const fileRate = params.data.fileRate || null;
        if (file) {
            const wavFile = new waveFile();
            wavFile.fromBase64(file);
            wavFile.fromALaw();
            getIntentFromSound(wavFile.toBuffer(), fileRate, params.GA_EMAIL, params.GA_KEY)
                .then(res => {
                    if(res.intent) {
                        resolve({
                            headers: {"Content-Type": "application/json"},
                            status: 200,
                            body: JSON.stringify({
                                data: {
                                    query: res.queryText,
                                    intent: res.intent.displayName,
                                    confidence: res.intentDetectionConfidence,
                                    message: res.fulfillmentText
                                },
                                module: "pg8-avatarConversation"
                            }) //TODO - Change module to handle response
                        })
                    } else {
                        resolve({
                            headers: {"Content-Type": "application/json"},
                            status: 200,
                            body: JSON.stringify({
                                data: {res},
                                module: "pg8-avatarConversation"
                            })
                        })
                    }
                })
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

function getIntentFromSound(buffer, rate, gaEmail, gaKey) {
    return new Promise((resolve, reject) => {
        const encoding = 'AUDIO_ENCODING_LINEAR_16';
        const sampleRateHertz = rate;
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

'use strict';

const uuid = require('uuid');
const dialogFlow = require("dialogflow");
const waveFile = require("wavefile");
const axios = require("axios");

let IBM_USER = "";
let IBM_PASS = "";
let IBM_URL = "";

function talkToDF(params) {
    return new Promise((resolve, reject) => {
        const file = params.data.soundFile || null;
        const fileRate = params.data.fileRate || null;
        IBM_USER = params.IBM_USER;
        IBM_PASS = params.IBM_PASS;
        IBM_URL = params.IBM_URL;
        if (file) {
            const wavFile = new waveFile();
            wavFile.fromBase64(file);
            wavFile.fromALaw();
            getIntentFromSound(wavFile.toBuffer(), fileRate, params.GA_EMAIL, params.GA_KEY)
                .then(handleIntent)
                .then(result => {
                    resolve({
                        headers: {"Content-Type": "application/json"},
                        status: 200,
                        body: JSON.stringify(result) //TODO - Change module to handle response
                    })
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

function handleIntent(dfResponse) {
    return new Promise(async (resolve, reject) => {
        if (dfResponse.intent.displayName === "Show recipe") {
            const recipeRes = await runRecipeFunc(["beef", "onion"]);
            resolve({
                data: {
                    query: dfResponse.queryText,
                    intent: dfResponse.intent.displayName,
                    confidence: dfResponse.intentDetectionConfidence,
                    message: {
                        action: "RECIPE_SHOW",
                        recipes: recipeRes.data,
                    }
                },
                module: "pg8-recipes"
            })
        } else {
            resolve({
                data: {
                    query: dfResponse.queryText,
                    intent: dfResponse.intent.displayName,
                    confidence: dfResponse.intentDetectionConfidence,
                    message: dfResponse.fulfillmentText
                },
                module: "pg8-avatarConversation"
            })
        }
    });
}

async function runRecipeFunc(ingredients) {
    const res = await axios.get({
        method: "POST",
        url: IBM_URL,
        auth: {
            username: IBM_USER,
            password: IBM_PASS
        },
        data: {
            data: {
                ingredients: ingredients
            }
        }
    });

    return res.data;
}

exports.talkToDF = talkToDF;

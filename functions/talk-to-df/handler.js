'use strict';

const uuid = require('uuid');
const dialogFlow = require("dialogflow");
const waveFile = require("wavefile");
const axios = require("axios");
const {jsonToStructProto, structProtoToJson} = require("./protoDF");

function talkToDF(params) {
    return new Promise((resolve, reject) => {
        const file = params.data.soundFile || null;
        const fileRate = params.data.fileRate || null;
        const sessionId = params.session || null;
        process.env.IBM_USER = params.IBM_USER;
        process.env.IBM_PASS = params.IBM_PASS;
        process.env.IBM_URL = params.IBM_URL;

        if (file) {
            const wavFile = new waveFile();
            wavFile.fromBase64(file);
            wavFile.fromALaw();
            getIntentFromSound(wavFile.toBuffer(), fileRate, sessionId, params.GA_EMAIL, params.GA_KEY)
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
                status: 400,
                body: JSON.stringify({data: `No File supplied`})
            });
        }
    });
}

function getIntentFromSound(buffer, rate, sessionId, gaEmail, gaKey) {
    return new Promise((resolve, reject) => {
        const encoding = 'AUDIO_ENCODING_LINEAR_16';
        const sampleRateHertz = rate;
        const languageCode = "en-US";
        // A unique identifier for the given session
        if(!sessionId){
            sessionId = uuid.v4();
        }

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
                const dfResponse = response[0].queryResult;
                dfResponse.sessionId = sessionId; //Adding session ID at object root level
                resolve(dfResponse);
            })
            .catch(err => reject(err));
    });
}

function handleIntent(dfResponse) {
    return new Promise((resolve, reject) => {
        const intent = dfResponse.intent.displayName;
        const sessionId = dfResponse.sessionId;
        if (intent === "Show recipe") {

            const ingredients = structProtoToJson(dfResponse.parameters).ingredient;
            runRecipeFunc(ingredients)
                .then(recipes => {
                    const responseMessage = {
                        action: "RECIPE_SHOW",
                        recipes: recipes,
                    };

                    resolve(packageResponse(dfResponse, sessionId, responseMessage, "pg8-recipes"))
                });
        } else if(intent === "Change recipe") {
            const change = structProtoToJson(dfResponse.parameters).Change;
            resolve(packageResponse(dfResponse, sessionId, {action: "RECIPE_CHANGE", change: change}, "pg8-recipes"))
        } else if(intent === "Change instruction") {
            const change = structProtoToJson(dfResponse.parameters).Change;
            resolve(packageResponse(dfResponse, sessionId, {action: "INSTRUCTION_CHANGE", change: change}, "pg8-recipes"))
        } else if(intent === "Close recipe") {
            resolve(packageResponse(dfResponse, sessionId, {action: "RECIPE_CLOSE"}, "pg8-recipes"))
        } else {
            const intentResponse = dfResponse.fulfillmentText;
            resolve(packageResponse(dfResponse, sessionId, intentResponse, "pg8-avatarConversation"))
        }
    });
}

function runRecipeFunc(ingredients) {
    return new Promise(resolve => {
        axios.request({
            method: "POST",
            url: process.env.IBM_URL,
            auth: {
                username: process.env.IBM_USER,
                password: process.env.IBM_PASS
            },
            data: {
                data: {
                    ingredients: ingredients
                }
            }
        })
            .then(res => {
                let response = res;
                //Accessing dumb IBM Cloud action response wrapper
                if(res.data.response && res.data.response.result && res.data.response.result.body) {
                    response = JSON.parse(res.data.response.result.body);
                }
                resolve(response.data);
            });
    });
}

function packageResponse(dfResponse, sessionId, message, module) {
    return {
        data: {
            query: dfResponse.queryText,
            intent: dfResponse.intent.displayName,
            confidence: dfResponse.intentDetectionConfidence,
            message: message
        },
        session: sessionId,
        module: module
    }
}

exports.talkToDF = talkToDF;

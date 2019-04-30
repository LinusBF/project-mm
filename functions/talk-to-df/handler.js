'use strict';

const dialogflow = require("dialogflow");

function talkToDF(params) {
  const name = params.name || 'World';
  return {
    headers: {"Content-Type": "application/json"},
    status: 200,
    body: JSON.stringify({data: `Hello, ${name}!`})
  };
}

exports.talkToDF = talkToDF;

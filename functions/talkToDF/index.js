const dialogflow = require("dialogflow");

function index(args) {
    return { result: "Hello World!" }
}

global.main = index;

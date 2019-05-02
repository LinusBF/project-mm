const fs = require("fs");
const wavefile = require("wavefile");
const axios = require('axios');

const data = fs.readFileSync('./test.wav');
const wav = new wavefile(data);
const b64 = wav.toBase64();

axios.post('ACTION_URL_WITH_BLOCKING',
    {
        file: b64
    },
    {
        auth: {
            username: "IBM API USER",
            password: "IBM API PASS"
        }
    })
    .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res)
    })
    .catch((err) => {
        console.log(err._source);
    });


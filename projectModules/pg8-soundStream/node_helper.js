/* Magic Mirror
 * Node Helper: PG8FaceDetect
 *
 * By ProjektGrupp8
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
const fs = require("fs");
const wavefile = require("wavefile");

module.exports = NodeHelper.create({
    server: null,
    start: function () {
        console.log("Starting module helper: " + this.name);
        this.startBackendServer();
    },
    startBackendServer: function() {
        const serverPath = __dirname + '/server.py';
        console.log("Starting soundStream server at " + serverPath);

        const spawn = require("child_process").spawn;
        this.server = spawn("python", ['-u', serverPath]);
	//this.addServerErrorLogging();
        this.addServerInfoLogging();
 	this.addServerExitLogging();
    },
    addServerInfoLogging: function() {
        this.server.stdout.on("data", (data) => {
            console.log("Output from soundStream server:");
            console.log(`${data}`);
        });
    },
    addServerErrorLogging: function() {
        this.server.stderr.on("data", (error) => {
            console.log("Error from soundStream server:");
            console.log(`${error}`);
        });
    },
    addServerExitLogging: function() {
        this.server.on('exit', function (code, signal) {
            console.log('soundStream server exited with ' + `code ${code} and signal ${signal}`);
        });
    },
    stop: function () {
        console.log("Stopping module helper: " + this.name);
        if (this.server !== null) this.server.kill('SIGINT');
    },

    socketNotificationReceived: function(notification, payload) {
	if("FILE_RECORDED" === notification){
	    if(payload.filename) {
            const data = fs.readFileSync(__dirname + "/" + payload.filename);
            const wav = new wavefile(data);
            const b64 = wav.toBase64();
            this.sendSocketotification("FILE_CONVERTED", {data: b64, filename: payload.filename});
        } else {
	        console.log("Missing filename in payload for FILE_RECORDED");
	        console.log(payload)
        }
	}
    },
});

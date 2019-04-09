/* Magic Mirror
 * Node Helper: PG8FaceDetect
 *
 * By Group 8
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	backendServer: null,
	start: function() {
		console.log("Starting module helper: " + this.name);
		const backendPath = __dirname + '/backend.py';

		console.log("Starting face-detect backend server at " + backendPath);

		const spawn = require("child_process").spawn;
		const pythonScript = spawn("python", ['-u', __dirname + '/backend.py']);
		this.backendServer = pythonScript;

		pythonScript.stdout.on("data", (data) => {
			console.log("Output from face-detect backend server:");
			console.log(`${data}`);
		});

		pythonScript.stderr.on("data", (data) => {
			console.log("Error from face-detect backend server:");
			console.log(`${data}`);
		});

		pythonScript.on('exit', function (code, signal) {
			console.log('Face-detect backend server exited with ' +
			`code ${code} and signal ${signal}`);
		});
	},
	stop: function() {
		console.log("Stopping module helper: " + this.name);
		if(this.backendServer !== null) this.backendServer.kill('SIGINT');
	},
	/*
	socketNotificationReceived: function(notification, payload) {
		
	},*/
});

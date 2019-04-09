/* global Module */

/* Magic Mirror
 * Module: PG8FaceDetect
 *
 * By Project Group 8
 * MIT Licensed.
 */

Module.register("pg8-faceDetect",{

	// Default module config.
	defaults: {
		refreshRate: 1,
	},

	faceInFrame: false,

	// Define start sequence.
	start: function() {
		console.log("Starting module: " + this.name);
		this.scheduleRefresh();
	},

	detectFace: function() {
		console.log("Testing for face in frame...");
		const spawn = require("child_process").spawn;
		const pythonScript = spawn("python", ['face_detect.py']);

		pythonScript.stdout.on('data', (data) => {
			console.log("Result from face detection");
			console.log(data);
			this.faceInFrame = (data === "True");
		});
		this.updateDom();
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		if (!this.faceInFrame) {
			wrapper.innerHTML = "No Face Detected";
			wrapper.className = "dimmed light small";
			return wrapper;
		}
		var large = document.createElement("div");
		large.className = "large light";

		var test = document.createElement("div");
		test.innerHTML = "Hi There!";
		large.appendChild(test);

		wrapper.appendChild(large);

		return wrapper;
	},

	/* scheduleRefresh()
	 * Schedule next face check.
	 *
	 *
	 */
	scheduleRefresh: function() {
		var nextLoad = this.config.refreshRate;

		var self = this;
		setTimeout(function() {
			self.detectFace();
			self.scheduleRefresh();
		}, nextLoad);
	},
});

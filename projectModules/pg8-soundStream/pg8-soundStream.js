/* global Module */

/*
 * Magic Mirror
 * Module: PG8SoundStream
 *
 * By ProjektGrupp8
 * MIT Licensed
 */

Module.register("pg8-soundStream", {
    // Default module config
    defaults: {
        url: "http://localhost:5002",
    },

    audioIntensity: [],
    medianIntensity: 6000,
    listeningActive: false,
    waitingForCloud: false,
    //Define
    start: function () {
        console.log("Starting module: " + this.name);
        this.listeningActive = false;
    },

    talkToPythonServer: function(method, path, data, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = callback;
        xhttp.open(method, this.config.url + path, true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({data: data}));
    },

    listenToSpeech: function () {
        if (!this.listeningActive) return;
        if (this.waitingForCloud) return;
        var that = this;
        this.talkToPythonServer("POST", "/listen-to-speech", this.medianIntensity, function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                var response = JSON.parse(this.responseText);
                that.waitingForCloud = true;
                that.sendSocketNotification("FILE_RECORDED", {filename: response.data});
            }
        });
    },

    deleteSpeech: function (filename) {
        this.talkToPythonServer("POST", "/delete-speech", filename, function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log("Deleted file: " + filename);
            }
        });
    },

    getDom: function() {

    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "FILE_CONVERTED") {
            this.deleteSpeech(payload.filename);
            this.sendNotification("REQUEST_CLOUD", {
                method: "POST",
                path: "/magic-mirror-dev-talk-to-df",
                data: {fileRate: payload.fileRate, soundFile: payload.data}
            });
        }
    },

    notificationReceived: function (notification, payload) {
        if (notification === "FACE_DETECTED") {
            this.listeningActive = true;
            this.listenToSpeech();
        } else if (notification === "FACE_MISSING") {
            this.listeningActive = false;
        } else if (notification === "CLOUD_RESPONSE_SUCCESS" && payload.sender === this.name) {
            this.waitingForCloud = false;
            this.listenToSpeech();
        }
    },


});

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
        refreshRate: 20000,
        url: "http://localhost:5002",
    },

    audioIntensity: [],
    medianIntensity: 6000,
    listeningActive: false,
    sentSpeech: false,
    //Define
    start: function () {
        console.log("Starting module: " + this.name);
        this.medianIntensity = 6000;
        this.listeningActive = false;
        this.updateAudioIntensity();
        this.updateAudioIntensity();
        this.updateAudioIntensity();
        this.scheduleRefresh();
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
        if(this.audioIntensity.length < 3){
            setTimeout(this.listenToSpeech, 1500);
            return;
        }
        console.log("Starting lts with intensity of " + this.medianIntensity);
        var that = this;
        this.talkToPythonServer("POST", "/listen-to-speech", this.medianIntensity, function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                var response = JSON.parse(this.responseText);
                that.sendSocketNotification("FILE_RECORDED", {filename: response.data});
                that.listenToSpeech();
            }
        });
    },

    updateAudioIntensity: function () {
        var that = this;
        this.talkToPythonServer("GET", "/get-intensity", "", function () {
            if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);
                that.calcMedianIntensity(response.data);
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

    calcMedianIntensity: function (new_intensity) {
        this.audioIntensity.push(new_intensity);
        this.medianIntensity = this.getMedian(this.audioIntensity);
        if (this.audioIntensity.length > 50) this.audioIntensity = this.audioIntensity.slice(0, 10);
    },

    getMedian: function(arr){
        if(arr.length === 0) return 0;
        arr.sort(function(a,b){
            return a-b;
        });
        var half = Math.floor(arr.length / 2);
        if (arr.length % 2)
            return arr[half];
        return (arr[half - 1] + arr[half]) / 2.0;
    },

    scheduleRefresh: function () {
        var nextLoad = this.config.refreshRate;
        var that = this;
        setTimeout(function () {
            that.updateAudioIntensity();
            that.scheduleRefresh();
        }, nextLoad);
    },

    getDom: function() {

    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "FILE_CONVERTED") {
            this.deleteSpeech(payload.filename);
            this.sendNotification("REQUEST_CLOUD", {path: "/magic-mirror-dev-talk-to-df", data: payload.data});
        }
    },

    notificationReceived: function (notification, payload) {
        if (notification === "FACE_DETECTED") {
            this.listeningActive = true;
            this.listenToSpeech();
        } else if (notification === "FACE_MISSING") {
            this.listeningActive = false;
        }
    },


});

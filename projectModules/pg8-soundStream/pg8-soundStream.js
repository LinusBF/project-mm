/* global Module */

/*
 * Magic Mirror
 * Module: PG8SoundStream
 *
 * By ProjektGrupp8
 * MIT Licensed
 */

Module.register("pg8-soundStream",{
    // Default module config
    defaults:{
        refreshRate: 20000,
    },

    audioIntensity: [],
    medianIntensity: 0,
    listeningActive = false,
    sentSpeech: false,
    //Define
    start: function () {
        console.log("Starting module: " + this.name);
	this.medianIntensity = 6000;
        this.listeningActive = false;
	var that = this;
        this.scheduleRefresh();
    },

    listenToSpeech: function () {
        if(!this.listeningActive) return;
	console.log("Starting lts with intensity of " + this.medianIntensity);
        var that = this;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
	    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
	        var response = JSON.parse(this.responseText);
	    	that.sendSocketNotification("FILE_RECORDED",response.data);
                that.listenToSpeech();
	    }
	};
	xhttp.open("POST","http://localhost:5002/listen-to-speech", true);
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({data: this.medianIntensity}));
    },

    getAudioIntensity: function () {
        var that = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
             if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);
                that.calcMedianIntensity(response.data);
            }
        };
        xhttp.open("GET","http://localhost:5002/get-threshold", true);
        xhttp.send();
    },

    calcMedianIntensity: function(new_intensity) {
        this.audioIntensity.push(new_intensity);
        this.medianIntensity = math.median(this.audioIntensity);
        if(that.audioIntensity.length > 50) this.audioIntensity = this.audioIntensity.slice(0, 10);
    },

    scheduleRefresh: function() {
        var nextLoad = this.config.refreshRate;
        var that = this;
        setTimeout(function () {
            that.getAudioIntensity();
            that.scheduleRefresh();
        }, nextLoad);
    },

    getDom: function() {

    },

    socketNotificationReceived: function(notification, payload) {
        if(notification === "FILE_CONVERTED"){
            this.sendNotification("REQUEST_CLOUD", {path:"/magic-mirror-dev-talk-to-df", data: payload.data});
        }
    },

    notificationReceived: function(notification, payload){
        if(notification === "FACE_DETECTED"){
            this.listeningActive = true;
            this.listenToSpeech();
        } else if(notification === "FACE_MISSING"){
            this.listeningActive = false;
        }
    },


});

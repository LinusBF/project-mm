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
        refreshRate: 60000,
    },

    audioIntensity: [],
    medianIntensity: 4500,
    sentSpeech: false,
    //Define
    start: function () {
        console.log("Starting module: " + this.name);
        this.getAudioIntensity();
        this.scheduleRefresh();
    },

    listenToSpeech: function () {
            var that = this;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                  if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                      var response = JSON.parse(this.responseText);
                      that.sentSpeech = (response.data);
                  }
            };
            xhttp.open("GET","http://localhost:5002/listen-to-speech", true);
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(JSON.stringify({data:medianIntensity}));
    },

    getAudioIntensity: function () {
        var that = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
             if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);
                that.audioIntensity.push.response.data;
            }
        };
        xhttp.open("GET","http://localhost:5002/listen-to-speech", true);
        xhttp.send();
    },

    scheduleRefresh: function() {
    var nextLoad = this.config.refreshRate;
        var self = this;
            setTimeout(function () {
                self.detectFace();
                self.scheduleRefresh();
        const median = arr => {
          const mid = Math.floor(arr.length / 2),
            nums = [...arr].sort((a, b) => a - b);
          return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
        };
        that.medianIntensity = median(that.audioIntensity)
        }, nextLoad);
    },

    getDom: function() {

    },


});
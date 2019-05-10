/* global Module */

/* Magic Mirror
 * Module: PG8FaceDetect
 *
 * By ProjektGrupp8
 * MIT Licensed.
 */

Module.register("pg8-faceDetect", {

    // Default module config.
    defaults: {
        refreshRate: 1000,
        refreshesUntilMissing: 5,
        url: "http://localhost:5001",
    },

    refreshesSinceLastFace: 0,
    faceInFrame: false,

    // Define start sequence.
    start: function () {
        console.log("Starting module: " + this.name);
        this.scheduleRefresh();
    },

    detectFace: function () {
        var that = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);
                if(response.data === true){
                    that.detectedFaceInFrame();
                } else {
                    that.detectedFaceMissing();
                }
            }
        };
        xhttp.open("GET", this.config.url + "/detect-face", true);
        xhttp.send();
    },

    // Override dom generator.
    getDom: function () {
        return document.createElement("div");
    },

    detectedFaceInFrame: function () {
        if(!this.faceInFrame) {
            this.faceInFrame = true;
            this.sendNotification('FACE_DETECTED');
        }
        this.refreshesSinceLastFace = 0;
    },

    detectedFaceMissing: function () {
        if(this.refreshesSinceLastFace === this.config.refreshesUntilMissing) {
            this.refreshesSinceLastFace++;
            this.faceInFrame = false;
            this.sendNotification('FACE_MISSING');
        } else {
            if(this.refreshesSinceLastFace <= this.config.refreshesUntilMissing) this.refreshesSinceLastFace++;
        }
    },

    /* scheduleRefresh()
     * Schedule next face check.
     *
     *
     */
    scheduleRefresh: function () {
        var nextLoad = this.config.refreshRate;

        var self = this;
        setTimeout(function () {
            self.detectFace();
            self.scheduleRefresh();
        }, nextLoad);
    },
});

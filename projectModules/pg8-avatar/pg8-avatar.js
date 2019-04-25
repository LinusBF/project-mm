/* global Module */

/* Magic Mirror
 * Module: PG8FaceDetect
 *
 * By ProjektGrupp8
 * MIT Licensed.
 */

Module.register("pg8-avatar", {

    // Default module config.
    defaults: {
        blinkInterval: 7000,
    },

    faceInFrame: false,

    // Define start sequence.
    start: function () {
        console.log("Starting module: " + this.name);
        this.scheduleRefresh();
    },

    blink: function () {
        Array.from(document.getElementsByClassName("topcircle")).forEach(
            function(element) {
                element.classList.add('eye-close');
            }
        );
        setTimeout(function() {
            Array.from(document.getElementsByClassName("topcircle")).forEach(
                function(element) {
                    element.classList.remove('eye-close');
                }
            );
        }, 1000);
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = 'avatar';

        wrapper.innerHTML = `
            <div class="eye1">
                <div class="bottomcircle-closed">
                    <div class="iris"></div>
                </div>
               <div class="topcircle"></div>
            </div>
            <div class="eye2">
                <div class="bottomcircle-closed">
                    <div class="iris"></div>
                </div>
               <div class="topcircle"></div>
            </div>
        `;

        return wrapper;
    },

    // Define required scripts.
    getStyles: function() {
        return ["avatar.css"];
    },

    /* scheduleRefresh()
     * Schedule next face check.
     *
     *
     */
    scheduleRefresh: function () {
        var nextLoad = this.config.blinkInterval;

        var self = this;
        setTimeout(function () {
            if (faceInFrame) {self.blink();}
            self.scheduleRefresh();
        }, nextLoad);
    },

    notificationReceived: function(notification){
        if (notification === 'FACE_DETECTED') {
            faceInFrame = true;
            Array.from(document.getElementsByClassName("topcircle")).forEach(
                function(element) {
                    element.classList.add('topcircle-open');
                }
            );
        }
    },
});

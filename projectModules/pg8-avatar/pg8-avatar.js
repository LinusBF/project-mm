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
        if (!this.faceInFrame) return;
        Array.from(document.getElementsByClassName("topcircle")).forEach(
            function (element) {
                element.classList.add('eye-close');
            }
        );

        const that = this;
        setTimeout(function () {
            if (!that.faceInFrame) return;
            Array.from(document.getElementsByClassName("topcircle")).forEach(
                function (element) {
                    element.classList.remove('eye-close');
                }
            );
        }, 1000);
    },

    openEyes: function () {
        Array.from(document.getElementsByClassName("topcircle")).forEach(
            function (element) {
                element.classList.add('topcircle-open');
                element.classList.remove('topcircle-closed');
            }
        );
    },

    closeEyes: function () {
        Array.from(document.getElementsByClassName("topcircle")).forEach(
            function (element) {
                element.classList.add('topcircle-closed');
                element.classList.remove('topcircle-open');
            }
        );
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = 'avatar';

        wrapper.innerHTML = `
        <div class="eye1">
            <div class="bottomcircle">
                <div class="iris"></div>
            </div>
           <div class="topcircle topcircle-closed"></div>
        </div>
        <div class="eye2">
            <div class="bottomcircle">
                <div class="iris"></div>
            </div>
           <div class="topcircle topcircle-closed"></div>
        </div>`;

        return wrapper;
    },

    // Define required scripts.
    getStyles: function () {
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
            if (self.faceInFrame) {
                self.blink();
            }
            self.scheduleRefresh();
        }, nextLoad);
    },

    notificationReceived: function (notification) {
        if (notification === 'FACE_DETECTED') {
            this.faceInFrame = true;
            this.openEyes();
        } else if(notification === 'FACE_MISSING') {
            this.faceInFrame = false;
            this.closeEyes();
        }
    },
});

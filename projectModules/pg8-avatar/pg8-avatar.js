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

    affectEyes: function(cssClass, add = false) {
        Array.from(document.getElementsByClassName("topcircle")).forEach(
            function (element) {
                if(add) element.classList.add(cssClass);
                else element.classList.remove(cssClass);
            }
        );
    },

    blink: function () {
        if (!this.faceInFrame) return;
        this.affectEyes('eye-blink', true);

        const that = this;
        setTimeout(function () {
            if (!that.faceInFrame) return;
            that.affectEyes('eye-blink', false);
        }, 1000);
    },

    openEyes: function () {
        this.affectEyes('eye-open', true);
        const that  = this;
        setTimeout(function() {
            that.affectEyes('topcircle-closed', false);
            that.affectEyes('topcircle-open', true);
            that.affectEyes('eye-open', false);
        }, 800);
    },

    closeEyes: function () {
        this.affectEyes('eye-close', true);
        const that  = this;
        setTimeout(function() {
            that.affectEyes('topcircle-open', false);
            that.affectEyes('topcircle-closed', true);
            that.affectEyes('eye-close', false);
        }, 1000);
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

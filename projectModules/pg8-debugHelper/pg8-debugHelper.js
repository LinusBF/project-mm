/* global Module */

/* Magic Mirror
 * Module: PG8DebugHelper
 *
 * By ProjektGrupp8
 * MIT Licensed.
 */

Module.register("pg8-debugHelper", {

    lastCloudResponse: {},

    // Define start sequence.
    start: function () {
        console.log("Starting module: " + this.name);
        this.lastCloudResponse.intent = "No Request Made";
        this.lastCloudResponse.query = "No Request Made";
        this.lastCloudResponse.conf = "No Request Made";
        this.lastCloudResponse.msg = "No Request Made";
        this.lastCloudResponse.module = "No Request Made";
        this.lastCloudResponse.trigger = "No Request Made";
    },

    // Define required scripts.
    getStyles: function() {
        return ["debugHelper.css"];
    },

    registerCloudResponse: function(response) {
        this.lastCloudResponse.intent = response.data.intent;
        this.lastCloudResponse.query = response.data.query;
        this.lastCloudResponse.conf = response.data.confidence.toString();
        this.lastCloudResponse.msg = response.data.message;
        this.lastCloudResponse.module = response.module;
        this.lastCloudResponse.trigger = response.sender;
        this.updateDom();
    },

    // Override dom generator.
    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.className = "debug-wrapper";

        const entries = Object.entries(this.lastCloudResponse);
        const that = this;

        entries.forEach(function(entry) {
            wrapper.appendChild(this.getPropertyDom(...entry));
        });

        return wrapper;
    },

    getPropertyDom: function(property, value) {
        const container = document.createElement("div");
        container.className = "debug-container";

        const name = document.createElement("p");
        name.innerText = property + ": " + value.slice(0, 15);
        container.appendChild(name);

        return container;
    },

    notificationReceived: function (notification, data) {
        if (notification === 'CLOUD_RESPONSE_SUCCESS') {
            this.registerCloudResponse(data);
        }
    },
});

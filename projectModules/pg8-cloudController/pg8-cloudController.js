/* global Module */

/* Magic Mirror
 * Module: PG8CloudController
 *
 * By ProjektGrupp8
 * MIT Licensed.
 */

Module.register("pg8-cloudController", {

    // Default module config.
    defaults: {
        apiKey: "",
        endpoint: "",
    },

    waitingForResponse: false,

    // Define start sequence.
    start: function () {
        console.log("Starting module: " + this.name);
    },

    makeRequest: function (method, path, sender, data) {
        var that = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if(this.readyState === 1) return; //Ignoring OPTIONS request response
            that.handleResponse(this.readyState === 4, this.status, this.responseText, sender);
        };
        xhttp.open(method, this.config.endpoint + path + "?blocking=true", true);
        if(method === "POST"){
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        }
        xhttp.setRequestHeader("Authorization", "Basic " + btoa(this.config.apiKey));
        xhttp.send(JSON.stringify({module: sender, data: data}));
    },

    handleResponse: function(success, status, data, sender){
        if(typeof data === "string" && data.startsWith("{")) data = JSON.parse(data);
        let response = data;
        if(data.response.result.body) { //Accessing dumb IBM Cloud action response wrapper
            response = JSON.parse(data.response.result.body);
        }

        if(success && status === 200){
            this.sendNotification("CLOUD_RESPONSE_SUCCESS", {module: response.module, sender: sender, data: response.data});
        } else if (success && status !== 404) {
            this.sendNotification("CLOUD_RESPONSE_STATUS", {module: sender, status: status, data: response});
        } else if (status === 404) {
            this.sendNotification("CLOUD_RESOURCE_NOT_FOUND", {module: sender});
        } else {
            this.sendNotification("CLOUD_RESPONSE_FAILURE", {module: sender, data: response});
        }
    },

    notificationReceived: function (notification, data, sender) {
        if (notification === 'REQUEST_CLOUD') {
            if(data.path.startsWith("/")) data.path = data.path.slice(1);
            this.makeRequest(data.method, data.path, sender.name, data.data);
        }
    },

    // Override dom generator.
    getDom: function () {
        return document.createElement("div");
    },
});

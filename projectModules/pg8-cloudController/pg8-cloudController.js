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
    currentSession: "",

    // Define start sequence.
    start: function () {
        console.log("Starting module: " + this.name);
        this.currentSession = "";
    },

    makeRequest: function (method, path, sender, data) {
        const that = this;
        const xhttp = new XMLHttpRequest();


        xhttp.onreadystatechange = function () {
            if(this.readyState === 1) return; //Ignoring OPTIONS request response
            if(this.readyState === 4) that.handleResponse(this.status, this.responseText, sender);
        };

        //TODO - Handle URL at top of function and check for existing GET vars
        xhttp.open(method, this.config.endpoint + path + "?blocking=true", true);
        if(method === "POST") xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.setRequestHeader("Authorization", "Basic " + btoa(this.config.apiKey));
        xhttp.send(JSON.stringify({module: sender, data: data, session: this.currentSession}));
    },

    handleResponse: function(status, data, sender){
        if(data === "") return;
        if(data.startsWith("{")) data = JSON.parse(data);

        console.log("Handling cloud response:\nStatus: ", status, "\nSender: ", sender, "\nData: ", data);

        let response = data;
        if(data.response && data.response.result && data.response.result.body) { //Accessing dumb IBM Cloud action response wrapper
            response = JSON.parse(data.response.result.body);
            this.currentSession = response.session;
            console.log("Cloud function responded with data: ", response);
        }

        if(status === 200){
            this.sendNotification("CLOUD_RESPONSE_SUCCESS", {module: response.module, sender: sender, data: response.data});
        } else if (status === 404) {
            this.sendNotification("CLOUD_RESOURCE_NOT_FOUND", {module: sender});
        } else if (status !== 404) {
            this.sendNotification("CLOUD_RESPONSE_STATUS", {module: sender, status, data: response});
        } else {
            this.sendNotification("CLOUD_RESPONSE_FAILURE", {module: sender, status, data: response});
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

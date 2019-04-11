/* global Module */

/* Magic Mirror
 * Module: PG8ApiStatus
 *
 * By ProjektGrupp8
 * MIT Licensed.
 */

Module.register("pg8-apiStatus", {

    // Default module config.
    defaults: {
        refreshRate: 5000,
        endpoints: [
            /* ON FORMAT
            {
                id: null,
                name: null,
                url: null,
                apiKey: null,
                expected: null,
            }
            */
        ],
    },

    status: {
        UP: "up",
        DOWN: "down",
        UNKNOWN: "loading",
    },

    endpointStatuses: {},

    // Define start sequence.
    start: function () {
        console.log("Starting module: " + this.name);
        for (let e in this.config.endpoints) {
            this.changeEndpointStatus(e, this.status.UNKNOWN);
        }
        this.updateDom();
        this.scheduleStatusPing();
    },

    // Define required scripts.
    getStyles: function() {
        return ["fontawesome.css", "apiStatus.css"];
    },

    pingEndpoint: function (endpoint, callback) {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(this.responseText);
                callback(response);
            }
        };
        xhttp.open("GET", endpoint.url, true);
        xhttp.send();
    },

    pingEnpoints: function () {
        const that = this;
        for(let e in this.config.endpoints){
            this.pingEndpoint(e, function(response){
                that.testEndpoint(e, response);
            });
        }
    },

    testEndpoint: function(endpoint, response) {
        if (endpoint.expected === response){
            this.changeEndpointStatus(endpoint, this.status.UP);
        } else {
            this.changeEndpointStatus(endpoint, this.status.DOWN);
        }
    },

    changeEndpointStatus: function(endpoint, status) {
        this.endpointStatuses[endpoint.id] = status;
        this.updateDom();
    },

    // Override dom generator.
    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.className = "endpoints-wrapper";

        for(let endpoint in this.config.endpoints){
            wrapper.appendChild(this.getEndpointDom(endpoint));
        }

        return wrapper;
    },

    getEndpointDom: function(endpoint) {
        const container = document.createElement("div");
        container.className = "endpoint-container";

        const icon = document.createElement("i");
        icon.className = "fas " + this.getStatusIcon(this.getEndpointStatus(endpoint));
        container.appendChild(icon);

        const name = document.createElement("p");
        name.innerText = endpoint.name;
        container.appendChild(name);

        return container;
    },

    getEndpointStatus(endpoint){
        return this.endpointStatuses[endpoint.id];
    },

    getStatusIcon: function(status) {
        if(status === this.status.UP){
            return "fa-check";
        } else if (status === this.status.DOWN) {
            return "fa-times";
        } else {
            return "fa-circle-notch";
        }
    },

    scheduleStatusPing: function () {
        var nextLoad = this.config.refreshRate;

        var self = this;
        setTimeout(function () {
            self.pingEnpoints();
            self.scheduleStatusPing();
        }, nextLoad);
    },
});

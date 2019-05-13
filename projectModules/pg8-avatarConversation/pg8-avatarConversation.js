/* global Module */

/*
 * Magic Mirror
 * Module: PG8SoundStream
 *
 * By ProjektGrupp8
 * MIT Licensed
 */

Module.register("pg8-avatarConversation", {
    avatarSays: "",

    start: function () {
        console.log("Starting module: " + this.name);
        this.avatarSays = "Hi";
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = 'avatarConversation';
        wrapper.innerText = this.avatarSays;
        return wrapper;
    },

    getStyles: function () {
        return ["conversationText.css"];
    },

    notificationReceived: function (notification, payload) {
        if (notification === "CLOUD_RESPONSE_SUCCESS" && this.name === payload.module) {
            this.avatarSays = payload.data.message;
            this.updateDom();
        }
    },
});

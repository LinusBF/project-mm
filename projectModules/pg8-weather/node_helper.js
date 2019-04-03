/* Magic Mirror
 * Node Helper: PG8Weather
 *
 * By Grupp8
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		console.log("Starting module: " + this.name);
	},
});

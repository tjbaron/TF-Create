
var tfplay = require('./tfplay');

exports.init = function() {
	exports.tfplay = new tfplay(document.getElementById('mainArea'));
	exports.activeObject = null;
	exports.activeTool = null;
	exports.snap = false;
};
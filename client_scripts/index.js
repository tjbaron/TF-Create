
var TFLayout = require('tflayout');
var statemanagerinstance = require('./statemanagerinstance');

var appdata = require('./appdata');
var toolsPane = require('./tools');
var objectsPane = require('./objects');
var propertiesPane = require('./properties');

objectsList = document.getElementById('objectsList');

window.onload = function() {
	appdata.init();
	toolsPane.init();
	objectsPane.init();
	propertiesPane.init();

	var sm = statemanagerinstance();
	sm.setState('selectproject');
	setTimeout(function() {
		sm.setState('project');
	},2000);

	var lastPos = null;
	document.body.ongesturechange = function(e) {
		appdata.ctx.scale(e.scale,e.scale);
	}

	/*function resizeCanvas() {
		appdata.canvas.width = appdata.canvas.offsetWidth*window.devicePixelRatio;
		appdata.canvas.height = appdata.canvas.offsetHeight*window.devicePixelRatio;
		appdata.ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
		appdata.ctx.clearRect(0,0,appdata.canvas.width,appdata.canvas.height);
		appdata.sceneObject.draw(appdata.ctx);
	}
	window.onresize = resizeCanvas;
	setTimeout(resizeCanvas, 3500);*/
};

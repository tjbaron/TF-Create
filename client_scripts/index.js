
var TFLayout = require('tflayout');
var statemanagerinstance = require('./statemanagerinstance');

var appdata = require('./appdata');
var toolsPane = require('./tools');
var objectsPane = require('./objects');
var propertiesPane = require('./properties');

objectsList = document.getElementById('objectsList');

var KEY = {minus:189, plus:187};

window.onload = function() {
	appdata.init();
	toolsPane.init();
	objectsPane.init();
	propertiesPane.init();

	var sm = statemanagerinstance();
	sm.setState('project');
	/*sm.setState('selectproject');
	setTimeout(function() {
		sm.setState('project');
	},2000);*/

	var lastPos = null;
	document.body.ongesturechange = function(e) {
		appdata.tfplay.context.scale(e.scale,e.scale);
		appdata.tfplay.refresh();
	}
	window.onkeydown = function(e) {
		if (e.keyCode === KEY.minus) {
			appdata.tfplay.context.scale(0.95238,0.95238);
			appdata.tfplay.refresh();
		} else if (e.keyCode === KEY.plus) {
			appdata.tfplay.context.scale(1.05,1.05);
			appdata.tfplay.refresh();
		}
	}

	document.body.addEventListener('dragover', cancel);
    document.body.addEventListener('dragenter', cancel);
	document.body.addEventListener('drop', function(e) {
		var dt = e.dataTransfer;
		var files = dt.files;
		for (var i=0; i<files.length; i++) {
			(function() {
				var file = files[i];
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.addEventListener('loadend', function() {
					if (file.type.indexOf('audio') !== -1) {
						var aud = appdata.tfplay.createObject('audio');
						aud.properties.src = reader.result;
						appdata.tfplay.refresh();
					} else {
						var img = appdata.tfplay.createObject('image');
						img.properties.image = new Image();
						img.properties.image.src = reader.result;
						appdata.tfplay.refresh();
					}
				});
			})();
		}
		e.preventDefault();
	});

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

function cancel(e) {
	e.preventDefault();
}

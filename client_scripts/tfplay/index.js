
var dom = require('tfdom');
var objectHandler = require('./objectHandler');

exports.properties = require('./properties');

var Instance = exports.Instance = function(container) {
	this.container = container;
	var canvas = this.canvas = dom.create('canvas', {
		'id': 'canvas',
		'style': 'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;',
		'width': container.offsetWidth*window.devicePixelRatio,
		'height': container.offsetHeight*window.devicePixelRatio,
		'parent': container
	});

	this.context = this.canvas.getContext('2d');
	this.context.scale(window.devicePixelRatio,window.devicePixelRatio);

	this.listeners = {};

	this.activeScene = this.createObject();
	this.loadedScenes = {main: this.activeScene};

	// A second 2D canvas and a WebGL canvas. These are shared between scene objects as temporary draw areas.
	this.utils = {};
	this.utils.canvas = dom.create('canvas', {
		width: canvas.width,
		height: canvas.height
	});
	this.utils.ctx = this.utils.canvas.getContext('2d');
	this.utils.glcanvas = dom.create('canvas', {
		//style: 'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;',
		width: canvas.width,
		height: canvas.height,
		//parent: container
	});
	var gl = this.utils.gl = this.utils.glcanvas.getContext('webgl') || this.utils.glcanvas.getContext('experimental-webgl');
	//alert(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
}

Instance.prototype.createObject = function(type, props) {
	var obj = new objectHandler(type, props, this.utils)
	if (this.activeScene) this.activeScene.children.push(obj);
	this.emit('createObject', obj);
	return obj;
};

Instance.prototype.refresh = function() {
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	if (this.backgroundData) {
		this.context.putImageData(this.backgroundData,0,0);
	}
	this.activeScene.draw(this.context, {from: this.backgroundObject});
};

Instance.prototype.fastrefresh = function() {
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	if (this.backgroundData) {
		this.context.putImageData(this.backgroundData,0,0);
	}
	this.activeScene.draw(this.context, {from: this.backgroundObject, fast: true});
};

Instance.prototype.lockbackground = function(obj, useCurrent) {
	if (useCurrent) {
		this.backgroundData = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
		this.backgroundObject = obj;
		return;
	}
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.backgroundObject = null;
	this.backgroundData = null;
	if (obj) {
		this.activeScene.draw(this.context, {to: obj});
		this.backgroundData = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
		this.backgroundObject = obj;
	}
	this.refresh();
}

Instance.prototype.on = function(ev, cb) {
	if (this.listeners[ev]) {
		this.listeners[ev].push(cb);
	} else {
		this.listeners[ev] = [cb];
	}
};

Instance.prototype.emit = function(ev, p) {
	if (!this.listeners[ev]) return;
	for (var i=0; i<this.listeners[ev].length; i++) {
		this.listeners[ev][i](p);
	}
};

Instance.prototype.json = function() {
	return JSON.stringify(this.activeScene.json());
};

Instance.prototype.enums = {
	'globalCompositeOperation': [
		'source-over',
		'source-in',
		'source-out',
		'source-atop',
		'destination-over',
		'destination-in',
		'destination-out',
		'destination-atop',
		'lighter',
		'copy',
		'xor',
		'multiply',
		'screen',
		'overlay',
		'darken',
		'lighten',
		'color-dodge',
		'color-burn',
		'hard-light',
		'soft-light',
		'difference',
		'exclusion',
		'hue',
		'saturation',
		'color',
		'luminosity'
	],
	'lineRenderer': [
		'brush',
		'pencil'
	],
	'playing': [
		'true',
		'false'
	],
	'lightType': [
		'DMX',
		'Hue',
		'WeMo'
	],
	'falloffType': [
		'path',
		'direct'
	],
	'fastRefresh': [
		'enabled',
		'disabled'
	]
};

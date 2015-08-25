
var dom = require('tfdom');
var objectHandler = require('./objectHandler');

module.exports = exports = function(container) {
	this.container = container;
	this.canvas = dom.create('canvas', {
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
}

exports.prototype.createObject = function(type) {
	var obj = new objectHandler(type)
	if (this.activeScene) this.activeScene.children.push(obj);
	this.emit('createObject', obj);
	return obj;
};

exports.prototype.refresh = function() {
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.activeScene.draw(this.context);
};

exports.prototype.fastrefresh = function() {
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.activeScene.draw(this.context, true);
};

exports.prototype.on = function(ev, cb) {
	if (this.listeners[ev]) {
		this.listeners[ev].push(cb);
	} else {
		this.listeners[ev] = [cb];
	}
};

exports.prototype.emit = function(ev, p) {
	if (!this.listeners[ev]) return;
	for (var i=0; i<this.listeners[ev].length; i++) {
		this.listeners[ev][i](p);
	}
};

exports.prototype.json = function() {
	return JSON.stringify(this.activeScene.json());
};

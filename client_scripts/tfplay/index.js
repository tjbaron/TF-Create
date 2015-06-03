
var baseobject = require('./baseobject');
var pathobject = require('./pathobject');
var circleobject = require('./circleobject');

module.exports = exports = function(container) {
	this.container = container;
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('style', 'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;');
	this.canvas.width = container.offsetWidth*window.devicePixelRatio;
	this.canvas.height = container.offsetHeight*window.devicePixelRatio;
	container.appendChild(this.canvas);

	this.context = this.canvas.getContext('2d');
	this.context.scale(window.devicePixelRatio,window.devicePixelRatio);

	this.activeScene = new baseobject();
	this.loadedScenes = {main: this.activeScene};

	this.listeners = {
		createObject: []
	};
}

exports.prototype.createObject = function(type) {
	var o = null;
	if (type === 'circle') o = new circleobject();
	else o = new pathobject();
	this.activeScene.children.push(o);
	this.emit('createObject', o);
	return o;
};

exports.prototype.refresh = function() {
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.activeScene.draw(this.context);
};

exports.prototype.on = function(ev, cb) {
	this.listeners[ev].push(cb);
};

exports.prototype.emit = function(ev, p) {
	for (var i=0; i<this.listeners[ev].length; i++) {
		this.listeners[ev][i](p);
	}
};

exports.prototype.json = function() {
	return JSON.stringify(this.activeScene.json());
};

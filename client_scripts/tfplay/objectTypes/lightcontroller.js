
exports.setup = function(utils) {
	var ObjH = require('../objectHandler');

	this.path = new ObjH('path', null, utils);
	this.path.properties.lineRenderer = 'pencil';
	this.path.properties.width = '10';

	this.properties.lightType = 'hue';
	this.properties.lightNumber = 4;
	this.hue = 1;
	this.saturaton = 255;
	this.brightness = 255;

	(function(that) {
		Object.defineProperty(that.properties, 'hue', {
			set: function(x) {
				if (that.timer) clearTimeout(that.timer);
				that.hue = x;
				that.timer = setTimeout(update.bind(null,that),500);
			},
			get: function() {
				return that.hue;
			},
			enumerable: true
		});
		Object.defineProperty(that.properties, 'saturaton', {
			set: function(x) {
				if (that.timer) clearTimeout(that.timer);
				that.saturaton = x;
				that.timer = setTimeout(update.bind(null,that),500);
			},
			get: function() {
				return that.saturaton;
			},
			enumerable: true
		});
		Object.defineProperty(that.properties, 'brightness', {
			set: function(x) {
				if (that.timer) clearTimeout(that.timer);
				that.brightness = x;
				that.timer = setTimeout(update.bind(null,that),500);
			},
			get: function() {
				return that.brightness;
			},
			enumerable: true
		});
	})(this);
}

exports.draw = function(ctx) {
	this.path.properties.points = [
		[this.properties.position[0]-5, this.properties.position[1]],
		[this.properties.position[0]+5, this.properties.position[1]],
	];
	this.path.draw.call(this.path, ctx, {});
}

function update(that) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("PUT", 'http://10.0.1.3/api/thomasbaron/lights/'+that.properties.lightNumber+'/state', true);
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			console.log(xmlhttp.responseText);
		}
	}
	var b = '{"on":true, "hue":'+that.properties.hue+', "sat":'+that.properties.saturaton+', "bri":'+that.properties.brightness+'}';
	xmlhttp.send(b);
}

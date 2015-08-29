
var obj = require('../objectHandler');

exports.setup = function() {
	this.properties.radius = 1.0;
	this.kernel = new obj('kernel');
}

exports.draw = function(ctx) {
	this.kernel.properties.kernel = [1.0,-0.5];
	this.kernel.properties.scale = 2;
	this.kernel.properties.offset = 128;
	this.kernel.draw(ctx);
}

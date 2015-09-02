
var kernel = require('./kernel');

exports.setup = function() {
	this.kernel = {properties:{}};
	kernel.setup.call(this.kernel);
	this.kernel.properties.kernel = [-1,-1,-1,-1,9,-1,-1,-1,-1];
	this.kernel.properties.scale = 1.0;
}

exports.draw = function(ctx) {
	kernel.draw.call(this.kernel, ctx);
}


var kernel = require('./kernel');

exports.setup = function(utils) {
	this.kernel = {properties:{}};
	kernel.setup.call(this.kernel, utils);
	this.kernel.properties.kernel = [-1,-1,-1,-1,9,-1,-1,-1,-1];
	this.kernel.properties.scale = 1.0;
}

exports.draw = function(ctx, fast) {
	kernel.draw.call(this.kernel, ctx, fast);
}


var kernel = require('./kernel');

exports.setup = function() {
	this.kernel = {properties:{}};
	kernel.setup.call(this.kernel);
}

exports.draw = function(ctx) {
	kernel.draw.call(this.kernel, ctx);
}

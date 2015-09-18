
var kernel = require('./kernel');

exports.setup = function(utils) {
	this.kernel = {properties:{}};
	kernel.setup.call(this.kernel, utils);
}

exports.draw = function(ctx, fast) {
	kernel.draw.call(this.kernel, ctx, fast);
}

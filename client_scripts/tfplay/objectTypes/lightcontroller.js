
exports.setup = function(utils) {
	var ObjH = require('../objectHandler');

	this.path = new ObjH('path', null, utils);
	this.path.properties.lineRenderer = 'pencil';
	this.path.properties.width = '10';
}

exports.draw = function(ctx) {
	this.path.properties.points = [
		[this.properties.position[0]-5, this.properties.position[1]],
		[this.properties.position[0]+5, this.properties.position[1]],
	];
	this.path.draw.call(this.path, ctx, {});
}


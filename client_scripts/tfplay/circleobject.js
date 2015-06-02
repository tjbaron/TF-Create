
var base = require('./baseobject');
var extend = require('./extend');

module.exports = exports = extend(function() {
	this.properties = {
		center: [0,0],
		radius: 0,
		width: 1.0
	};
	this.children = [];
}, base);

exports.prototype.draw = function(ctx) {
	var props = this.properties;
	ctx.lineWidth = props.width;

	var pnts = props.points;
	ctx.beginPath();
	ctx.arc(
		this.properties.center[0],
		this.properties.center[1],
		this.properties.radius,
		0, 2 * Math.PI, false);
	ctx.stroke();

	this.super.draw();
}

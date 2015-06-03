
var base = require('./baseobject');
var extend = require('./extend');

module.exports = exports = extend(function() {
	this.type = 'path';
	this.properties = {
		points: [],
		width: 1.0
	};
	this.children = [];
}, base);

exports.prototype.draw = function(ctx) {
	var props = this.properties;
	ctx.lineWidth = props.width;

	var pnts = props.points;
	ctx.beginPath();
	if (pnts.length > 0) ctx.moveTo(pnts[0][0],pnts[0][1]);
	for (var i=1; i<pnts.length; i++) {
		ctx.lineTo(pnts[i][0],pnts[i][1]);
	}
	ctx.stroke();

	this.super.draw();
}

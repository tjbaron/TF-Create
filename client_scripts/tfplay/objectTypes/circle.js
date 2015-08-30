
exports.setup = function() {
	var p = this.properties;
	p.center = [0,0],
	p.radius = 0,
	p.lineWidth = 1.0
}

exports.draw = function(ctx) {
	var p = this.properties;

	ctx.beginPath();
	ctx.arc(
		p.center[0],
		p.center[1],
		p.radius,
		0, 2 * Math.PI, false);
	ctx.stroke();
}



module.exports = exports = function() {
	this.properties = {
		points: [],
		width: 1.0
	};
	this.children = [];
}

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

	for (var j=0; j<this.children.length; j++) {
		this.children[j].draw(ctx);
	}
}


module.exports = function(ctx) {
	var p = this.properties;
	ctx.lineWidth = p.width;
	ctx.strokeStyle = p.lineColor.generate();
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';

	var pnts = p.points;
	ctx.beginPath();
	if (pnts.length > 0) ctx.moveTo(pnts[0][0],pnts[0][1]);
	for (var i=1; i<pnts.length; i++) {
		ctx.lineTo(pnts[i][0],pnts[i][1]);
	}
	ctx.stroke();
}

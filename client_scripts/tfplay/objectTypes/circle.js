
exports.setup = function() {
	var p = this.properties;
	p.center = [0,0],
	p.radius = 0,
	p.lineWidth = 1.0
}

exports.draw = function(ctx) {
	var p = this.properties;
	var rad = Math.ceil(p.radius);
	var x = p.center[0];
	var y = p.center[1];
	
	var grd = ctx.createRadialGradient(x,y,0,x,y,rad);
	grd.addColorStop(0,"rgba(0,0,0,1)");
	grd.addColorStop(1,"rgba(0,0,0,0)");

	ctx.fillStyle = grd;
	ctx.fillRect(p.center[0]-rad, p.center[1]-rad, rad*2, rad*2);
}


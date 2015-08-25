
exports.setup = function() {
	this.properties.radius = 1.0;
}

exports.draw = function(ctx) {
	var d = ctx.getImageData(0, 0, 1000, 1000).data;
	var n = new Uint8ClampedArray(4000000);
	for (var i=0; i<4000000; i++) {
		if (i%4 === 0) {
			n[i] = 255;
		} else {
			n[i] = d[i];
		}
	}
	ctx.putImageData(new ImageData(n, 1000, 1000), 0, 0);
}

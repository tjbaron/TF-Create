
exports.setup = function() {
	this.properties.radius = 1.0;
}

exports.draw = function(ctx) {
	var rad = this.properties.radius;
	var width = 1000;
	var height = 1000;
	var d = ctx.getImageData(0, 0, width, height).data;
	var n = new Uint8ClampedArray(width*height*4);

	for (var y=0; y<height; y++) {
		var yoff = width*4*y;
		for (var x=0; x<width; x++) {
			var offset = yoff + (x*4);
			var red = d[offset];
			var green = d[offset+1];
			var blue = d[offset+2];
			var alpha = d[offset+3];
			for (var i=1; i<rad+1; i++) {
				var poff = offset+(i*4);
				var noff = offset-(i*4);
				if (x+i<width) {
					red += d[poff];
					green += d[poff+1];
					blue += d[poff+2];
					alpha += d[poff+3];
				}
				if (x-i>=0) {
					red += d[noff];
					green += d[noff+1];
					blue += d[noff+2];
					alpha += d[noff+3];
				}
			}
			var samples = (1+(rad*2));
			n[offset] = Math.floor(red/samples);
			n[offset+1] = Math.floor(green/samples);
			n[offset+2] = Math.floor(blue/samples);
			n[offset+3] = Math.floor(alpha/samples);
		}
	}
	ctx.putImageData(new ImageData(n, width, height), 0, 0);
}

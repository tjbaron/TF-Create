
exports.setup = function() {
	this.properties.kernel = [1,0];
	this.properties.scale = 1.0;
	this.properties.offset = 0.0;
}

exports.draw = function(ctx) {
	var props = this.properties;
	var kern = props.kernel;

	var width = 1000;
	var height = 1000;
	var d = ctx.getImageData(0, 0, width, height).data;
	var n = new Uint8ClampedArray(width*height*4);

	for (var y=0; y<height; y++) {
		var yoff = width*4*y;
		for (var x=0; x<width; x++) {
			var offset = yoff + (x*4);
			var red = d[offset] * kern[0];
			var green = d[offset+1] * kern[0];
			var blue = d[offset+2] * kern[0];
			var alpha = d[offset+3] * kern[0];
			for (var i=1; i<kern.length; i++) {
				if (x+i<width) {
					red += d[offset+(i*4)] * kern[i];
					green += d[offset+(i*4)+1] * kern[i];
					blue += d[offset+(i*4)+2] * kern[i];
					alpha += d[offset+(i*4)+3] * kern[i];
				}
				if (x-i>=0) {
					red += d[offset-(i*4)] * kern[i];
					green += d[offset-(i*4)+1] * kern[i];
					blue += d[offset-(i*4)+2] * kern[i];
					alpha += d[offset-(i*4)+3] * kern[i];
				}
			}
			n[offset] = Math.floor(red);
			n[offset+1] = Math.floor(green);
			n[offset+2] = Math.floor(blue);
			n[offset+3] = Math.floor(alpha);
		}
	}
	ctx.putImageData(new ImageData(n, width, height), 0, 0);
}

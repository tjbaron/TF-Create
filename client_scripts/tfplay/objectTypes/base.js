
exports.setup = function() {
	this.properties.radius = 1.0;
}

exports.draw = function(ctx) {
	
}

exports.postdraw = function(ctx) {
	var start = (new Date()).getTime()
var r2 = 2*Math.pow(this.properties.radius, 2);
	var weights = [1.0,-0.5];
	/*for (var x=0; x<Math.ceil(this.properties.radius*3); x++) {
		weights.push( (1/Math.pow(Math.PI*r2,0.5)) * Math.exp(-Math.pow(x,2)/r2) );
		//console.log(weights[weights.length-1]);
	}*/

	var width = 1000;
	var height = 1000;
	var d = ctx.getImageData(0, 0, width, height).data;
	var n = new Uint8ClampedArray(width*height*4);

	for (var y=0; y<height; y++) {
		var yoff = width*4*y;
		for (var x=0; x<width; x++) {
			var offset = yoff + (x*4);
			var red = d[offset] * weights[0];
			var green = d[offset+1] * weights[0];
			var blue = d[offset+2] * weights[0];
			var alpha = d[offset+3] * weights[0];
			for (var i=1; i<weights.length; i++) {
				if (x+i<width) {
					red += d[offset+(i*4)] * weights[i];
					green += d[offset+(i*4)+1] * weights[i];
					blue += d[offset+(i*4)+2] * weights[i];
					alpha += d[offset+(i*4)+3] * weights[i];
				}
				if (x-i>=0) {
					red += d[offset-(i*4)] * weights[i];
					green += d[offset-(i*4)+1] * weights[i];
					blue += d[offset-(i*4)+2] * weights[i];
					alpha += d[offset-(i*4)+3] * weights[i];
				}
			}
			n[offset] = (Math.floor(red)/2)+128;
			n[offset+1] = (Math.floor(green)/2)+128;
			n[offset+2] = (Math.floor(blue)/2)+128;
			n[offset+3] = 255;//Math.floor(alpha);
		}
	}
	ctx.putImageData(new ImageData(n, width, height), 0, 0);
	console.log((new Date()).getTime()-start);
}

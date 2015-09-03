
var dom = require('tfdom');

exports.setup = function() {
	this.properties.low = 0;
	this.properties.mid = 128;
	this.properties.high = 255;

	this.canvas = document.getElementById('canvas');
}

exports.draw = function(ctx, fast) {
	if (fast) return fastdraw.call(this, ctx);
	var p = this.properties;
	var scale = 255/(p.high-p.low);

	var d = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
	var sz = this.canvas.width*this.canvas.height*4;
	for (var i=0; i<sz; i+=4) {
		d[i] = scale*(d[i]-p.low);
		d[i+1] = scale*(d[i+1]-p.low);
		d[i+2] = scale*(d[i+2]-p.low);
	}
	ctx.putImageData(new ImageData(d, this.canvas.width, this.canvas.height), 0, 0);
}

function fastdraw(ctx) {

}

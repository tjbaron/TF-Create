
exports.setup = function() {
	this.canvas = document.getElementById('canvas');
}

exports.draw = function(ctx, fast) {
	if (fast) return;
	var d = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
	var sz = this.canvas.width*this.canvas.height*4;
	for (var i=0; i<sz; i+=4) {
		d[i] = 255-d[i];
		d[i+1] = 255-d[i+1];
		d[i+2] = 255-d[i+2];
	}
	ctx.putImageData(new ImageData(d, this.canvas.width, this.canvas.height), 0, 0);
}

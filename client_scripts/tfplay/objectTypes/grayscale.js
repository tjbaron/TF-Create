
exports.setup = function() {

}

exports.draw = function(ctx) {
	var d = ctx.getImageData(0, 0, 1000, 1000).data;
	for (var i=0; i<4000000; i+=4) {
		d[i] = d[i+1] = d[i+2] = Math.floor((d[i]+d[i+1]+d[i+2])/3);

	}
	ctx.putImageData(new ImageData(d, 1000, 1000), 0, 0);
}

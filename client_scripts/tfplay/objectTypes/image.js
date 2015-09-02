
exports.setup = function() {
	var p = this.properties;
	p.image = null;
	p.scale = [1.5,1.5];
	p.globalCompositeOperation = 'source-over';
}

exports.draw = function(ctx) {
	var p = this.properties;
	if (p.image !== null) {
		ctx.drawImage(p.image, 0, 0);
	}
}

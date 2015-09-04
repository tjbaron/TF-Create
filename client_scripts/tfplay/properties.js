
exports.Color = function(r,g,b,a) {
	this.type = 'color';
	this.red = r!==undefined ? r : 0;
	this.green = g!==undefined ? g : 0;
	this.blue = b!==undefined ? b : 0;
	this.alpha = a!==undefined ? a : 1.0;
};

exports.Color.prototype.generate = function() {
	return 'rgba('+this.red+','+this.green+','+this.blue+','+this.alpha+')';
};

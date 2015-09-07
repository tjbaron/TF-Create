
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

exports.Color.prototype.toString = function() {
	return '<div style="float: left; margin-right: 5px; width: 16px; height: 16px; border: 1px solid black; background: '+this.generate()+'"></div> '+this.red+','+this.green+','+this.blue+','+this.alpha;
};

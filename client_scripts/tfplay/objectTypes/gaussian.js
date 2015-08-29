
var obj = require('../objectHandler');

exports.setup = function() {
	this.properties.radius = 1.0;
	this.kernel = new obj('kernel');
}

exports.draw = function(ctx) {
	var r2 = 2*Math.pow(this.properties.radius, 2);
	var weights = [];
	for (var x=0; x<Math.ceil(this.properties.radius*3); x++) {
		weights.push( (1/Math.pow(Math.PI*r2,0.5)) * Math.exp(-Math.pow(x,2)/r2) );
	}

	this.kernel.properties.kernel = weights;
	this.kernel.draw(ctx);
}


var kernel = require('./kernel');

exports.setup = function() {
	this.kernel = {properties:{alpha: true}};
	kernel.setup.call(this.kernel);

	this.radius = 5;
	this.kernel.properties.kernel = setMatrix(this.radius);

	(function(that) {
		Object.defineProperty(that.properties, 'radius', {
			set: function(rad) {
				that.radius = rad;
				that.kernel.properties.kernel = setMatrix(rad);
			},
			get: function() {
				return that.radius;
			}
		});
	})(this);
}

function setMatrix(rad) {
	var r = Math.ceil(rad);
	var kernelWidth = (r*2)+1;
	var r2 = 2*Math.pow(rad, 2);
	var weights = [];
	for (var x=0; x<kernelWidth; x++) {
		for (var y=0; y<kernelWidth; y++) {
			weights.push( (1/(Math.PI*r2)) * Math.exp(-(Math.pow(x-r,2)+Math.pow(y-r,2))/r2) );
		}
	}
	return weights;
}

exports.draw = function(ctx, fast) {
	kernel.draw.call(this.kernel, ctx, fast);
}

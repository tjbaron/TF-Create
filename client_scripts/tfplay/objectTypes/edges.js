
var kernel = require('./kernel');

exports.setup = function(utils) {
	this.properties.width = 1;
	this.kernel = {properties:{}};
	kernel.setup.call(this.kernel, utils);
	/*this.kernel.properties.kernel = [
		 0.00, -0.05, -0.05, -0.05,  0.00,
		-0.05, -0.05, -0.05, -0.05, -0.05,
		-0.05, -0.05,  1.00, -0.05, -0.05,
		-0.05, -0.05, -0.05, -0.05, -0.05,
		 0.00, -0.05, -0.05, -0.05,  0.00
	];*/
	/*this.kernel.properties.kernel = [
		-0.125, -0.125, -0.125,
		-0.125,  1.000, -0.125,
		-0.125, -0.125, -0.125
	];*/
}

exports.draw = function(ctx, fast) {
	var kern = [];
	var dim = (this.properties.width * 2 + 1);
	var segs = -1/(dim*dim - 1);
	for (var i=0; i<dim; i++) {
		for (var j=0; j<dim; j++) {
			kern.push(segs);
		}
	}
	kern[Math.floor(kern.length/2)] = 1.0;
	this.kernel.properties.kernel = kern;
	console.log(kern);
	
	kernel.draw.call(this.kernel, ctx, fast);
}

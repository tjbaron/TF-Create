
var dom = require('tfdom');
var properties = require('../../properties');

var renderers = {
	pencil: require('./path'),
	brush: require('./brush'),
	poly: require('./poly')
};

exports.setup = function(utils) {
	var p = this.properties;
	p.width = 1.0;
	p.points = [];
	p.lineColor = new properties.Color();
	p.fillColor = new properties.Color(0,0,0,0.0);
	p.lineRenderer = 'poly';

	this.glcanvas = utils.glcanvas;
	this.gl = utils.gl;
}

exports.draw = function(ctx, fast) {
	if (fast) {
		renderers.pencil.call(this, ctx);
	} else {
		renderers[this.properties.lineRenderer].call(this, ctx);
	}
}

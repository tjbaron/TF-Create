
var objectTypes = {
	base: require('./objectTypes/base'),
	circle: require('./objectTypes/circle'),
	path: require('./objectTypes/path'),
	image: require('./objectTypes/image')
};

module.exports = exports = function(type) {
	if (!type) type = 'base';
	this.properties = {
		position: [0.0,0.0],
		rotation: 0.0,
		scale: [1.0,1.0]
	};
	this.children = [];
	this.type = objectTypes[type];
	if (objectTypes[type]) this.type.setup.call(this);
};

exports.prototype.draw = function(ctx, fast) {
	ctx.save();
	ctx.scale(this.properties.scale[0], this.properties.scale[1]);
	ctx.translate(this.properties.rotation, 0);
	for (var e in this.properties) {
		var p = this.properties[e];
		if (ctx[e] && typeof(ctx[e]) !== 'function') {
			if (typeof(p) === 'object' && p.generate) {
				ctx[e] = p.generate();
			} else {
				ctx[e] = p;
			}
		}
	}
	this.type.draw.call(this, ctx);
	for (var i=0; i<this.children.length; i++) {
		this.children[i].draw(ctx, fast);
	}
	if (this.type.postdraw && !fast) this.type.postdraw.call(this, ctx);
	ctx.restore();
}

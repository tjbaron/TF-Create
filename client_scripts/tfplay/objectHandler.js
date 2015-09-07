
var objectTypes = {
	base: require('./objectTypes/base'),
	circle: require('./objectTypes/circle'),
	path: require('./objectTypes/path'),
	image: require('./objectTypes/image'),
	edges: require('./objectTypes/edges'),
	gaussian: require('./objectTypes/gaussian'),
	grayscale: require('./objectTypes/grayscale'),
	invert: require('./objectTypes/invert'),
	kernel: require('./objectTypes/kernel'),
	levels: require('./objectTypes/levels'),
	sharpen: require('./objectTypes/sharpen'),
	clone: require('./objectTypes/clone'),
	lightcontroller: require('./objectTypes/lightcontroller')
};

var nextId = 0;

module.exports = exports = function(type, props, utils) {
	if (!type) type = 'base';
	this.properties = {
		position: [0.0,0.0],
		rotation: 0.0,
		scale: [1.0,1.0]
	};
	this.id = nextId;
	this.name = type;
	this.children = [];
	this.type = objectTypes[type];
	if (objectTypes[type]) this.type.setup.call(this, utils);
	if (props) {
		for (var e in props) {
			this.properties[e] = props[e];
		}
	}
	nextId++;
};

exports.prototype.draw = function(ctx, props) {
	if ((props.to && props.to.id === this.id) || props.done) {
		props.done = true;
		return;
	}
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
	if (props.from && props.from.id === this.id) props.from = null;
	if (!props.from) this.type.draw.call(this, ctx, props.fast);
	for (var i=0; i<this.children.length; i++) {
		this.children[i].draw(ctx, props);
	}
	if (!props.from && this.type.postdraw) this.type.postdraw.call(this, ctx, props.fast);
	ctx.restore();
}

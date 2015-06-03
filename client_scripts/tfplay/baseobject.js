
module.exports = exports = function() {
	this.type = 'base';
	this.properties = {};
	this.children = [];
}

exports.prototype.draw = function(ctx) {
	for (var j=0; j<this.children.length; j++) {
		this.children[j].draw(ctx);
	}
}

exports.prototype.json = function() {
	var r = {
		type: this.type,
		properties: this.properties,
		children: []
	};
	for (var i=0; i<this.children.length; i++) r.children.push(this.children[i].json());
	return r;
}

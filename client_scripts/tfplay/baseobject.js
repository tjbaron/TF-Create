
module.exports = exports = function() {
	this.properties = {};
	this.children = [];
}

exports.prototype.draw = function(ctx) {
	for (var j=0; j<this.children.length; j++) {
		this.children[j].draw(ctx);
	}
}


module.exports = function(Child, Parent) {
	Child.prototype = new Parent();
	Child.prototype.constructor = Child;
	var s = {};
	for (var e in Child.prototype) {
		s[e] = Child.prototype[e];
	}
	Child.prototype.super = s;
	return Child;
};

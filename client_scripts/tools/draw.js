
var d = require('../appdata');
var tfmouseposition = require('../tfmouseposition');

exports.name = 'Draw';

exports.properties = {
	lineWidth: 2
};

exports.ondown = function() {
	d.activeObject = d.tfplay.createObject('path');
	d.activeObject.properties.width = exports.properties.lineWidth;
}

exports.onmove = function(e) {
	var newPos = tfmouseposition(e, d.tfplay.canvas);
	if (d.activeObject) {
		d.activeObject.properties.points.push(newPos);
		d.tfplay.fastrefresh();
	}
}

exports.onup = function() {
	d.tfplay.refresh();
}


var utils = require('../utils');
var d = require('../appdata');
var tfmouseposition = require('../tfmouseposition');

exports.name = 'Draw';

exports.properties = {
	lineWidth: 10,
	minPointDistance: 5
};

exports.ondown = function() {
	d.activeObject = d.tfplay.createObject('path');
	d.activeObject.properties.width = exports.properties.lineWidth;
	d.tfplay.lockbackground(d.activeObject, true);
}

exports.onmove = function(e) {
	var newPos = tfmouseposition(e, d.tfplay.canvas);
	if (d.activeObject) {
		var pnts = d.activeObject.properties.points;
		if (pnts.length > 0) {
			var last = pnts[pnts.length-1];
			var dist = utils.distance(newPos, last);
			if (dist < exports.properties.minPointDistance) return;
		}
		pnts.push(newPos);
		d.tfplay.fastrefresh();
	}
}

exports.onup = function() {
	d.tfplay.refresh();
}

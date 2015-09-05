
var utils = require('../utils');
var d = require('../appdata');
var tfmouseposition = require('../tfmouseposition');

exports.name = 'Clone';

exports.properties = {
	lineWidth: 20,
	minPointDistance: 5,
	offsetX: 50,
	offsetY: 0
};

exports.ondown = function() {
	d.activeObject = d.tfplay.createObject('clone');
	d.activeObject.properties.width = exports.properties.lineWidth;
	d.activeObject.properties.offsetX = exports.properties.offsetX;
	d.activeObject.properties.offsetY = exports.properties.offsetY;
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
		d.tfplay.refresh();
	}
}

exports.onup = function() {

}

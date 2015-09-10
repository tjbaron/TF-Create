
var d = require('../../appdata');
var tfmouseposition = require('../../tfmouseposition');

exports.name = 'Line';

exports.properties = {
	lineWidth: 10
};

var makingLine = false;

exports.ondown = function(e) {
	var newPos = tfmouseposition(e, d.tfplay.canvas);
	var pnts = null;
	if (!makingLine) {
		d.activeObject = d.tfplay.createObject('path');
		d.activeObject.properties.width = exports.properties.lineWidth;
		makingLine = true;
	}
	if (d.activeObject) {
		pnts = d.activeObject.properties.points;
		pnts.push(newPos);
		d.tfplay.fastrefresh();
	}
};

exports.onmove = function(e) {
	var newPos = tfmouseposition(e, d.tfplay.canvas);
	if (d.activeObject) {
		var pnts = d.activeObject.properties.points;
		if (pnts.length > 0) {
			pnts[pnts.length-1] = newPos;
		}
		d.tfplay.fastrefresh();
	}
};

exports.onkey = function(key) {
	if (key === 27 || key === 13) {
		makingLine = false;
	}
};

exports.onselect = function() {
	makingLine = false;
};

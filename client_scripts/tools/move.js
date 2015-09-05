
var utils = require('../utils');
var d = require('../appdata');
var tfmouseposition = require('../tfmouseposition');

var lastPos = null;

var pointId = -1;

exports.name = 'Move';

exports.properties = {};

exports.ondown = function(e) {
	var scene = d.tfplay.activeScene;
	lastPos = tfmouseposition(e, d.tfplay.canvas);
	var dist = 99999;
	var obj = null;
	pointId = -1;
	for (var i=0; i<scene.children.length; i++) {
		var c = scene.children[i];
		if (c.properties.points) {
			var pnts = c.properties.points;
			for (var j=0; j<pnts.length; j++) {
				var newDist = utils.distance(lastPos, pnts[j]);
				if (newDist < dist) {
					obj = c;
					pointId = j;
					dist = newDist;
				}
			}
		}
	}
	if (obj !== null) d.activeObject = obj;
}

exports.onmove = function(e) {
	if (pointId === -1) return;
	var newPos = tfmouseposition(e, d.tfplay.canvas);
	d.activeObject.properties.points[pointId][0] += newPos[0]-lastPos[0];
	d.activeObject.properties.points[pointId][1] += newPos[1]-lastPos[1];
	lastPos = newPos;
	d.tfplay.fastrefresh();
}

exports.onup = function(e) {
	d.tfplay.refresh();
}


var utils = require('../../utils');
var d = require('../../appdata');
var tfmouseposition = require('../../tfmouseposition');

var lastPos = null;

var pointId = -1;
var movingPoints = [];

exports.name = 'Smooth';

exports.properties = {
	'falloff': 0,
	'falloffType': 'path'
};

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

	var points = d.activeObject.properties.points;
	var falloff = this.properties.falloff;
	var falloffType = this.properties.falloffType;

	movingPoints = [];
	if (falloffType === 'path') {
		var dist = 0;
		for (var i=pointId+1; i<points.length; i++) {
			dist += utils.distance(points[i-1], points[i]);
			if (dist < falloff) {
				var weight = 1 - (dist/falloff);
				movingPoints.push({weight: weight, id: i});
			} else break;
		}
		dist = 0;
		for (var i=pointId-1; i>=0; i--) {
			dist += utils.distance(points[i+1], points[i]);
			if (dist < falloff) {
				var weight = 1 - (dist/falloff);
				movingPoints.push({weight: weight, id: i});
			} else break;
		}
	} else if (falloffType === 'direct') {
		for (var i=0; i<points.length; i++) {
			if (i === pointId) continue;
			var dist = utils.distance(points[pointId], points[i]);
			if (dist < falloff) {
				var weight = 1 - (dist/falloff);
				movingPoints.push({weight: weight, id: i});
			}
		}
	}
}

exports.onmove = function(e) {
	if (pointId === -1) return;
	var points = d.activeObject.properties.points;
	var newPos = tfmouseposition(e, d.tfplay.canvas);

	for (var i=0; i<movingPoints.length; i++) {
		var p = movingPoints[i];
		points[p.id][0] += (newPos[0]-lastPos[0]) * p.weight;
		points[p.id][1] += (newPos[1]-lastPos[1]) * p.weight;
	} 

	points[pointId][0] += newPos[0]-lastPos[0];
	points[pointId][1] += newPos[1]-lastPos[1];
	lastPos = newPos;
	d.tfplay.fastrefresh();
}

exports.onup = function(e) {
	d.tfplay.refresh();
}


var d = require('../appdata');
var tfmouseposition = require('../tfmouseposition');
var lastPos = null;

exports.name = 'Empty';

exports.properties = {
	lineWidth: 1
};

exports.ondown = function(e) {
	lastPos = tfmouseposition(e, d.tfplay.canvas);
}

exports.onmove = function(e) {
	var newPos = tfmouseposition(e, d.tfplay.canvas);
	for (var i=0; i<d.activeObject.properties.points.length; i++) {
		d.activeObject.properties.points[i][0] += newPos[0]-lastPos[0];
		d.activeObject.properties.points[i][1] += newPos[1]-lastPos[1];
	}
	lastPos = newPos;
	d.tfplay.refresh();
}

exports.onup = function(e) {

}

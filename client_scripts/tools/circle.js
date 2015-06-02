
var d = require('../appdata');
var tfmouseposition = require('../tfmouseposition');

var startX = 0;

exports.name = 'Circle';

exports.properties = {
	lineWidth: 1
};

exports.ondown = function(e) {
	var newPos = tfmouseposition(e, d.tfplay.canvas);
	startX = newPos[0];
	d.activeObject = d.tfplay.createObject('circle');
	d.activeObject.properties.center = newPos;
}

exports.onmove = function(e) {
	var newPos = tfmouseposition(e, d.tfplay.canvas);
	if (d.activeObject) {
		d.activeObject.properties.radius = Math.abs(newPos[0]-startX);
		d.tfplay.refresh();
	}
}

exports.onup = function() {

}

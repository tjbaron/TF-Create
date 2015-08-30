
var d = require('../appdata');
var tfmouseposition = require('../tfmouseposition');

exports.name = 'Clone';

exports.properties = {
	lineWidth: 20,
	offsetX: 50,
	offsetY: 0
};

exports.ondown = function() {
	d.activeObject = d.tfplay.createObject('clone');
	d.activeObject.properties.width = exports.properties.lineWidth;
	d.activeObject.properties.offsetX = exports.properties.offsetX;
	d.activeObject.properties.offsetY = exports.properties.offsetY;
}

exports.onmove = function(e) {
	var newPos = tfmouseposition(e, d.tfplay.canvas);
	if (d.activeObject) {
		d.activeObject.properties.points.push(newPos);
		d.tfplay.refresh();
	}
}

exports.onup = function() {

}

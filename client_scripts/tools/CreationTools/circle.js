
var d = require('../../appdata');
var tfmouseposition = require('../../tfmouseposition');

exports.name = 'Circle';

exports.properties = {
	lineWidth: 5
};

exports.ondown = function(e) {
	d.activeObject = d.tfplay.createObject('circle', exports.properties);
	d.activeObject.properties.center = tfmouseposition(e, d.tfplay.canvas);
}

exports.onmove = function(e) {
	var newPos = tfmouseposition(e, d.tfplay.canvas);
	if (d.activeObject) {
		var c = d.activeObject.properties.center;
		d.activeObject.properties.radius = Math.abs(newPos[0]-c[0]);
		
		var widthVariance = c[1]-newPos[1]-20;
		if (widthVariance < 0) widthVariance = 0;
		d.activeObject.properties.lineWidth = Math.abs(exports.properties.lineWidth+widthVariance);

		d.tfplay.refresh();
	}
}

exports.onup = function() {

}

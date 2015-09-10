
var d = require('../../appdata');
var tfmouseposition = require('../../tfmouseposition');

exports.name = 'Light Placer';

exports.properties = {
	lineWidth: 10
};


exports.ondown = function(e) {
	var newPos = tfmouseposition(e, d.tfplay.canvas);
	d.activeObject = d.tfplay.createObject('lightcontroller');
	d.activeObject.properties.position = newPos;
	d.tfplay.refresh();
};

exports.onmove = function(e) {

};

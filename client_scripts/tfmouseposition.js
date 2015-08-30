
var d = require('./appdata');

function getElementOffset(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return [curleft, curtop];
}

module.exports = function(e, ele) {
	var offset = getElementOffset(ele);
	var mousePos = [e.pageX-offset[0], e.pageY-offset[1]];
	if (d.snap) {
		mousePos = [Math.round(mousePos[0]/20)*20, Math.round(mousePos[1]/20)*20];
	}
	return mousePos;
}

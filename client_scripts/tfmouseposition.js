
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
	return [e.pageX-offset[0], e.pageY-offset[1]]
}

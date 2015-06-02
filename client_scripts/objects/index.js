
var TFLayout = require('tflayout');
var appdata = require('../appdata');

var objectsList = document.getElementById('objectsList');

exports.init = function() {
	var objectsLayout = new TFLayout({
		'styleprefix': 'TFL-'
	});
	appdata.tfplay.on('createObject', function() {
		c = [{'type': 'header', 'contents': [{'type': 'text', 'value': 'Scene Objects', 'stylesuffix': '-Head'}]}];
		for (var i=0; i<appdata.tfplay.activeScene.children.length; i++) {
			c.push({'type': 'text', 'value': i});
		}
		objectsList.innerHTML = '';
		objectsList.appendChild(objectsLayout.build([{'type': 'group', 'select': true, 'contents': c}]));
	});
}

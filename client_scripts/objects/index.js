
var TFLayout = require('tflayout');
var appdata = require('../appdata');

var objectsList = document.getElementById('objectsList');

exports.init = function() {
	var objectsLayout = new TFLayout({
		'styleprefix': 'TFL-'
	});
	appdata.tfplay.on('createObject', function() {
		var olist = [];
		var c = [
			{'type': 'header', 'contents': [
				{'type': 'text', 'value': 'Scene Objects', 'stylesuffix': '-Head'}
			]},
			{type: 'input', search: 'Objects', stylesuffix: '-Head'},
			{'type': 'group', id: 'Objects', 'select': true, 'oncontext': ['Rename','Duplicate','Delete'], 'contents': olist}
		];
		for (var i=0; i<appdata.tfplay.activeScene.children.length; i++) {
			olist.push({'type': 'text', 'value': i});
		}
		objectsList.innerHTML = '';
		objectsList.appendChild(objectsLayout.build(c));
	});
}

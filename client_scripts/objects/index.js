
var TFLayout = require('tflayout');
var appdata = require('../appdata');
var properties = require('../properties');

var objectsList = document.getElementById('objectsList');

exports.init = function() {
	var objectsLayout = new TFLayout({
		'styleprefix': 'TFL-'
	});

	objectsLayout.on('click', function(val) {
		appdata.activeObject = appdata.tfplay.activeScene.children[val];
		properties.refresh();
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
			olist.push({'type': 'text', 'value': i, 'onclick': ''+i});
		}
		objectsList.innerHTML = '';
		objectsList.appendChild(objectsLayout.build(c));
	});
}

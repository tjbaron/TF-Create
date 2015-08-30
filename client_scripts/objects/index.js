
var TFLayout = require('tflayout');
var appdata = require('../appdata');
var properties = require('../properties');

var objectsList = document.getElementById('objectsList');
var objectsLayout = null;

exports.init = function() {
	objectsLayout = new TFLayout({
		'styleprefix': 'TFL-'
	});

	objectsLayout.on('click', function(e) {
		appdata.activeObject = appdata.tfplay.activeScene.children[e];
		properties.refresh();
	});

	objectsLayout.on('context', function(e) {
		if (e.data === 'Delete') {
			appdata.tfplay.activeScene.children.splice(e.column, 1);
			exports.refresh();
			appdata.tfplay.refresh();
		}
	});

	appdata.tfplay.on('createObject', exports.refresh);
};

exports.refresh = function() {
	var olist = [];
	var c = [
		{'type': 'header', 'contents': [
			{'type': 'text', 'value': 'Scene Objects', 'stylesuffix': '-Head'}
		]},
		{type: 'input', search: 'Objects', stylesuffix: '-Head'},
		{'type': 'group', id: 'Objects', 'select': true, 'dragsort': true, 'oncontext': ['Rename','Duplicate','Delete'], 'contents': olist}
	];
	var ch = appdata.tfplay.activeScene.children;
	for (var i=0; i<ch.length; i++) {
		olist.push({'type': 'text', 'value': ch[i].name, 'id': i, 'onclick': ''+i});
	}
	objectsList.innerHTML = '';
	objectsList.appendChild(objectsLayout.build(c));
};

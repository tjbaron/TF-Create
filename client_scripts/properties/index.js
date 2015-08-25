
var TFLayout = require('tflayout');
var appdata = require('../appdata');

var propertiesList = document.getElementById('propertiesList');
var propertiesLayout;

var p = null;
var toolProperties = false;

exports.init = function() {
	propertiesLayout = new TFLayout({
		'styleprefix': 'TFL-'
	});
	propertiesLayout.on('click', function(v) {
		p[v]++;
		props();
		appdata.tfplay.refresh();
	});
}

exports.refresh = function() {
	toolProperties = false;
	p = appdata.activeObject.properties;
	props();
};

exports.viewTool = function() {
	toolProperties = true;
	p = appdata.activeTool.properties;
	props();
};

function props() {
	var rows = [];
	for (var e in p) {
		rows.push({'type': 'row', 'contents': [
			{'type': 'text', 'value': e},
			{'type': 'text', 'value': p[e], 'onclick': e}
		]});
	}

	propertiesList.innerHTML = '';
	propertiesList.appendChild(propertiesLayout.build([
		{'type': 'header', 'contents': [
			{'type': 'text', 'value': toolProperties ? 'Tool Properties' : 'Object Properties', 'stylesuffix': '-Head'}
		]},
		{'type': 'group', 'contents': rows}
	]));
}

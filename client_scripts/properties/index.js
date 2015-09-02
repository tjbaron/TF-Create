
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
	propertiesLayout.on('change', function(e) {
		p[e.name] = e.value;
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
		var inp = null;
		if (typeof(p[e]) === 'number') {
			inp = {'type': 'input', 'subtype': 'number', 'name': e, 'value': p[e], 'onchange': true};
		} else if (appdata.tfplay.enums[e]) {
			inp = {'type': 'input', 'subtype': 'dropdown', 'options': appdata.tfplay.enums[e], 'name': e, 'value': p[e], 'onchange': true};
		} else if (typeof(p[e]) === 'string') {
			inp = {'type': 'input', 'subtype': 'text', 'name': e, 'value': p[e], 'onchange': true};
		} else {
			inp = {'type': 'text', 'value': p[e]};
		}
		rows.push({'type': 'row', 'contents': [
			{'type': 'text', 'value': e},
			inp
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

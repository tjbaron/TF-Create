
var dom = require('tfdom');
var TFLayout = require('tflayout');
var appdata = require('../appdata');

var colorPicker = require('./colorPicker');

var propertiesList = document.getElementById('propertiesList');
var propertiesLayout;

var p = null;
var toolProperties = false;

exports.init = function() {
	propertiesLayout = new TFLayout({
		'parent': propertiesList,
		'styleprefix': 'TFL-'
	});
	propertiesLayout.on('change', function(e) {
		if (typeof(p[e.name]) === 'number') p[e.name] = Number(e.value);
		else p[e.name] = e.value;
		appdata.tfplay.refresh();
	});
	propertiesLayout.on('click', function(e) {
		colorPicker();
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
			var el = p[e];
			if (el.toString) el = el.toString();
			inp = {'type': 'column', 'html': el, 'onclick': e};
		}
		rows.push({'type': 'row', 'contents': [
			{'type': 'text', 'value': e},
			inp
		]});
	}

	propertiesList.innerHTML = '';
	propertiesLayout.build([
		{'type': 'header', 'contents': [
			{'type': 'text', 'value': toolProperties ? 'Tool Properties' : 'Object Properties', 'stylesuffix': '-Head'}
		]},
		{'type': 'group', 'contents': rows, 'oncontext': ['Formula']}
	]);
}

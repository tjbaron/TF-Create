
var TFLayout = require('tflayout');
var appdata = require('../appdata');

var propertiesList = document.getElementById('propertiesList');

exports.init = function() {
	var propertiesLayout = new TFLayout({
		'styleprefix': 'TFL-'
	});
	propertiesList.appendChild(propertiesLayout.build([
		{'type': 'header', 'contents': [
			{'type': 'text', 'value': 'Object Properties', 'stylesuffix': '-Head'}
		]},
		{'type': 'group', 'contents': [
			{'type': 'text', 'value': 'Line Width', 'onclick': 'minus'},
			{'type': 'text', 'value': 1, 'onclick': 'plus'}
		]}
	]));
}

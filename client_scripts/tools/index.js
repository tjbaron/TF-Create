
var d = require('../appdata');
var TFLayout = require('tflayout');

var activeTool = 0;
var isDown = false;
var tools = [
	require('./empty'),
	require('./camera'),
	require('./draw'),
	require('./line'),
	require('./circle'),
	require('./rectangle'),
	require('./shape'),
	require('./cog'),
	require('./text'),
	require('./reference')
];

exports.init = function() {
	var toolsLayout = new TFLayout({
		'styleprefix': 'TFL-'
	});

	toolsLayout.on('click', function(val) {
		if (val === 'save') {
			alert(d.tfplay.json());
		} else {
			activeTool = val;
		}
	});

	var tlist = [];
	var c = [
		{type: 'input', search: ['MainpulateTools','CreateTools','Snapping','Commands'], stylesuffix: '-Head'},
		{type: 'header', contents: [
			{type: 'text', value: 'Manipulation', stylesuffix: '-Head'}
		]},
		{type: 'group', id: 'MainpulateTools', contents: [
			{'type': 'text', 'value': 'Select'},
			{'type': 'text', 'value': 'Translate'},
			{'type': 'text', 'value': 'Rotate'},
			{'type': 'text', 'value': 'Move Pivot'}
		]},
		{type: 'header', contents: [
			{type: 'text', value: '2D Creation', stylesuffix: '-Head'}
		]},
		{type: 'group', id: 'CreateTools', select: true, contents: tlist},
		{type: 'header', contents: [
			{type: 'text', value: 'Snapping', stylesuffix: '-Head'}
		]},
		{type: 'group', id: 'Snapping', multiselect: true, contents: [
			{'type': 'text', 'value': 'Grid'},
			{'type': 'text', 'value': 'Object'},
			{'type': 'text', 'value': 'Point'}
		]},
		{type: 'header', contents: [
			{type: 'text', value: 'Commands', stylesuffix: '-Head'}
		]},
		{type: 'group', id: 'Commands', contents: [
			{'type': 'text', 'value': 'Save Scene', 'onclick': 'save'},
			{'type': 'text', 'value': 'Load Scene'},
			{'type': 'text', 'value': 'Reduce Points'},
			{'type': 'text', 'value': 'Merge Lines'},
		]}
	];
	for (var i=0; i<tools.length; i++) {
		var t = tools[i];
		tlist.push({'type': 'text', 'value': t.name, 'onclick': ''+i});
	}

	toolsList.appendChild(toolsLayout.build(c));

	d.tfplay.container.onmousedown = down;
	document.body.onmousemove = move;
	document.body.onmouseup = up;
}

function down(e) {
	isDown = true;
	tools[activeTool].ondown(e);
}

function move(e) {
	if (isDown) {
		tools[activeTool].onmove(e);
	}
}

function up(e) {
	isDown = false;
	tools[activeTool].onup(e);
}


var d = require('../appdata');
var properties = require('../properties');
var TFLayout = require('tflayout');
var JSZip = require('jszip');

var isDown = false;
var tools = [
	//require('./empty'),
	//require('./camera'),
	require('./move'),
	require('./draw'),
	require('./clone'),
	require('./line'),
	require('./circle'),
	//require('./rectangle'),
	//require('./shape'),
	//require('./cog'),
	//require('./text'),
	//require('./reference')
];
var effects = {
	'Brush': 'brush',
	'Edge Detect': 'edges',
	'Gaussian Blur': 'gaussian',
	'Grayscale': 'grayscale',
	'Invert': 'invert',
	'Levels': 'levels',
	'Sharpen': 'sharpen'
};

exports.init = function() {
	d.activeTool = tools[2];
	
	var toolsLayout = new TFLayout({
		'styleprefix': 'TFL-',
		'parent': toolsList
	});

	toolsLayout.on('click', function(e) {
		if (e.data === 'save') {
			//alert(d.tfplay.json());

			var png = d.tfplay.canvas.toDataURL("image/png");
			var zip = new JSZip();
			var imgs = zip.folder('images');
			imgs.file("0001.png", png.substr(22), {base64: true});
			imgs.file("0002.png", png.substr(22), {base64: true});
			var content = zip.generate({type:"base64"});

			var a = document.createElement('a');
			a.href = 'data:application.zip;base64,'+content;
			a.download = 'images.zip';
			a.click();
		} else if (e.data === 'snap') {
			d.snap = !d.snap;
		} else if (effects[e.data]) {
			d.tfplay.createObject(effects[e.data]);
			d.tfplay.refresh();
		} else {
			d.activeTool = tools[e.data];
			if (d.activeTool.onselect) {
				d.activeTool.onselect();
			}
			properties.viewTool();
		}
	});

	var tlist = [];
	var elist = [];
	var c = [
		{type: 'input', search: ['ManipulateTools','2DCreate','EffectsCreate','Snapping','Commands'], stylesuffix: '-Head'},
		{type: 'header', contents: [
			{type: 'text', value: 'Manipulation', stylesuffix: '-Head'}
		]},
		{type: 'group', id: 'ManipulateTools', contents: [
			//{'type': 'text', 'value': 'Move', 'onclick': 'move'}
			/*{'type': 'text', 'value': 'Translate'},
			{'type': 'text', 'value': 'Rotate'},
			{'type': 'text', 'value': 'Move Pivot'}*/
		]},
		{type: 'header', contents: [
			{type: 'text', value: '2D Creation', stylesuffix: '-Head'}
		]},
		{type: 'group', id: '2DCreate', select: true, contents: tlist},
		{type: 'header', contents: [
			{type: 'text', value: 'Effects Creation', stylesuffix: '-Head'}
		]},
		{type: 'group', id: 'EffectsCreate', contents: elist},
		{type: 'header', contents: [
			{type: 'text', value: 'Snapping', stylesuffix: '-Head'}
		]},
		{type: 'group', id: 'Snapping', multiselect: true, contents: [
			{'type': 'text', 'value': 'Grid', 'onclick': 'snap'}/*,
			{'type': 'text', 'value': 'Object'},
			{'type': 'text', 'value': 'Point'}*/
		]},
		{type: 'header', contents: [
			{type: 'text', value: 'Exporting', stylesuffix: '-Head'}
		]},
		{type: 'group', id: 'Commands', contents: [
			{'type': 'text', 'value': 'PNG (Images)', 'onclick': 'save'},
			{'type': 'text', 'value': 'SVG (Vectors)', 'onclick': 'save'}
			/*{'type': 'text', 'value': 'Load Scene'},
			{'type': 'text', 'value': 'Reduce Points'},
			{'type': 'text', 'value': 'Merge Lines'},*/
		]}
	];
	for (var i=0; i<tools.length; i++) {
		var t = tools[i];
		tlist.push({'type': 'text', 'value': t.name, 'onclick': ''+i});
	}
	for (var e in effects) {
		elist.push({'type': 'text', 'value': e, 'onclick': e});
	}

	toolsLayout.build(c);

	d.tfplay.container.onmousedown = down;
	document.body.onmousemove = move;
	document.body.onmouseup = up;
	document.body.onkeyup = keyup;
}

function down(e) {
	isDown = true;
	d.activeTool.ondown(e);
}

function move(e) {
	if (isDown) {
		d.activeTool.onmove(e);
	}
}

function up(e) {
	isDown = false;
	if (d.activeTool.onup) {
		d.activeTool.onup(e);
	}
}

function keyup(e) {
	if (d.activeTool.onkey) {
		d.activeTool.onkey(e.keyCode);
	}
}


var d = require('../appdata');
var properties = require('../properties');
var TFLayout = require('tflayout');
var JSZip = require('jszip');

var isDown = false;

var lists = [
	{
		id: 'ManipulationTools',
		name: 'Manipulation Tools',
		children: [
			require('./ManipulationTools/move'),
			require('./ManipulationTools/smooth')
		]
	},
	{
		id: 'CreationTools',
		name: 'Creation Tools',
		children: [
			require('./CreationTools/draw'),
			require('./CreationTools/clone'),
			require('./CreationTools/line'),
			require('./CreationTools/circle'),
			require('./CreationTools/lightautomation')
		]
	},
	{
		id: 'Operations',
		name: 'Operations',
		children: [
			require('./Operations/reduce'),
		]
	},
	{
		id: 'Effects',
		name: 'Effects',
		children: [
			{name: 'Edge Detect', createObject: 'edges'},
			{name: 'Gaussian Blur', createObject: 'gaussian'},
			{name: 'Grayscale', createObject: 'grayscale'},
			{name: 'Invert', createObject: 'invert'},
			{name: 'Levels', createObject: 'levels'},
			{name: 'Sharpen', createObject: 'sharpen'}
		]
	}
];
var toolLookup = {};

var tools = [
	//require('./empty'),
	//require('./camera'),
	//require('./rectangle'),
	//require('./shape'),
	//require('./cog'),
	//require('./text'),
	//require('./reference')
];

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
		} else if (toolLookup[e.data]) {
			var t = toolLookup[e.data];
			if (t.createObject) {
				d.tfplay.createObject(t.createObject);
				d.tfplay.refresh();
			} else {
				d.activeTool = t;
				if (d.activeTool.onselect) {
					d.activeTool.onselect();
				}
				properties.viewTool();
			}
		}
	});

	var c = [
		{type: 'input', search: ['ManipulationTools', 'CreationTools','Operations','Effects','Snapping','Scene','Export'], stylesuffix: '-Head'}
	];

	for (var i=0; i<lists.length; i++) {
		var l = lists[i];
		var t = [];

		for (var j=0; j<l.children.length; j++) {
			var child = l.children[j];
			t.push({'type': 'text', 'value': child.name, 'onclick': child.name});
			toolLookup[child.name] = child;
		}

		c.push({type: 'header', contents: [
			{type: 'text', value: l.name, stylesuffix: '-Head'}
		]});
		c.push({type: 'group', id: l.id, contents: t});
	}
	d.activeTool = toolLookup['Draw'];

	c.join([
		// Snapping
		{type: 'header', contents: [
			{type: 'text', value: 'Snapping', stylesuffix: '-Head'}
		]},
		{type: 'group', id: 'Snapping', multiselect: true, contents: [
			{'type': 'text', 'value': 'Grid', 'onclick': 'snap'}
		]},

		{type: 'header', contents: [
			{type: 'text', value: 'Scene', stylesuffix: '-Head'}
		]},
		{type: 'group', id: 'Scene', contents: [
			{'type': 'text', 'value': 'Save', 'onclick': 'save'},
			{'type': 'text', 'value': 'Load', 'onclick': 'save'}
		]},
		{type: 'header', contents: [
			{type: 'text', value: 'Export', stylesuffix: '-Head'}
		]},
		{type: 'group', id: 'Export', contents: [
			{'type': 'text', 'value': 'Scene File', 'onclick': 'save'},
			{'type': 'text', 'value': 'PNG (Images)', 'onclick': 'save'},
			{'type': 'text', 'value': 'SVG (Vectors)', 'onclick': 'save'}
		]}
	]);

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


var TFLayout = require('tflayout');

var activeTool = 0;
var isDown = false;
var tools = [
	require('./draw'),
	require('./circle')
];

exports.init = function() {
	var toolsLayout = new TFLayout({
		'styleprefix': 'TFL-'
	});

	toolsLayout.on('click', function(val) {
		console.log(val);
		activeTool = val;
	});

	var c = [
	{'type': 'text', 'value': 'Tools', 'stylesuffix': '-Head'}
	];
	for (var i=0; i<tools.length; i++) {
		var t = tools[i];
		c.push({'type': 'text', 'value': t.name, 'onclick': ''+i});
	}

	toolsList.appendChild(toolsLayout.build([{'type': 'group', 'select': true, 'contents': c}]));

	document.body.onmousedown = down;
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

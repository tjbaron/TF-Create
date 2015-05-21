
var TFLayout = require('tflayout');
var StateManager = require('./statemanager');

var tfmouseposition = require('./tfmouseposition');
var tfobject = require('./tfobject');

var sm = null;

var pencilWidth = 1.0;

var toolsLayout = new TFLayout({
	'styleprefix': 'TFL-'
});
toolsLayout.on('click', function() {
	sm.setState('selectproject');
	setTimeout(function() {
		sm.setState('project');
	},2000);
});
toolsList.appendChild(toolsLayout.build([{'type': 'group', 'contents': [
	{'type': 'text', 'value': 'Object Manipulation', 'stylesuffix': '-Head', 'columnclick': true},
	{'type': 'text', 'value': 'Translate Object'},
	{'type': 'text', 'value': 'Scale Object'},
	{'type': 'text', 'value': 'Rotate Object'},
	{'type': 'text', 'value': 'Set Pivot'},
	{'type': 'text', 'value': 'Object Creation', 'stylesuffix': '-Head'},
	{'type': 'text', 'value': 'Draw', 'onclick': 'draw'},
	{'type': 'text', 'value': 'Line Tool'},
	{'type': 'text', 'value': 'Rectangle Tool'},
	{'type': 'text', 'value': 'Ellipse Tool'},
	{'type': 'text', 'value': 'Reference Tool'},
	{'type': 'text', 'value': 'Point Manipulation', 'stylesuffix': '-Head'},
	{'type': 'text', 'value': 'Translate Points'}
]}]));

var propertiesLayout = new TFLayout({
	'styleprefix': 'TFL-'
});
propertiesLayout.on('click', function(e) {
	if (e === 'plus') pencilWidth++;
	else pencilWidth--;
	buildProperties();
});
function buildProperties() {
	propertiesList.innerHTML = '';
	propertiesList.appendChild(propertiesLayout.build([{'type': 'group', 'contents': [
		//{'type': 'row', 'contents': [
			{'type': 'text', 'value': 'Line Width', 'onclick': 'minus'},
			{'type': 'text', 'value': pencilWidth, 'onclick': 'plus'}
		//]}
	]}]));
}
buildProperties();

window.onload = function() {
	sm = new StateManager(
		{
			'title': {
				'opacity': {
					'default': '0.0',
					'duration': '1.0'
				}
			},
			'body': {
				'background': {
					'default': 'rgb(48,48,48)',
					'duration': '1.0'
				}
			},
			'mainArea': {
				'top': {
					'default': '-100%',
					'duration': '1.0'
				}
			},
			'toolsList': {
				'top': {
					'default': '100%',
					'duration': '1.0'
				}
			},
			'propertiesList': {
				'right': {
					'default': '-300px',
					'duration': '1.0'
				}
			}
		},
		{
			'project': {
				'body': {'background': 'rgb(96,96,96)'},
				'mainArea': {'top': '0%'},
				'toolsList': {'top': '0%'},
				'propertiesList': {'right': '0px'},
			},
			'selecttransition': {
				'body': {'background': 'rgb(48,48,48)'}
			},
			'selectproject': {
				'body': {'background': 'rgb(48,48,48)'},
				'title': {'opacity': '1.0'}
			}
		},
		{
			'selectproject-project': ['selecttransition']
		}
	);
	sm.setState('selectproject');
	setTimeout(function() {
		sm.setState('project');
	},2000);

	var canvas = document.getElementById('mainCanvas')
	var ctx = canvas.getContext('2d');
	var sceneObject = new tfobject();
	var activeObject = null;

	var lastPos = null;
	document.body.onmousedown = function(e) {
		activeObject = new tfobject();
		activeObject.properties.width = pencilWidth;
		sceneObject.children.push(activeObject);
	};
	document.body.onmousemove = function(e) {
		var newPos = tfmouseposition(e, canvas);
		if (e.altKey) {
			if (!lastPos) lastPos = newPos;
			ctx.scale(1.0+((newPos[0]-lastPos[0])/1000.0), 1.0+((newPos[0]-lastPos[0])/1000.0));
			lastPos = newPos;
			ctx.clearRect(0,0,canvas.width,canvas.height);
			sceneObject.draw(ctx);
		} else {
			lastPos = null;
			
			if (activeObject) {
				activeObject.properties.points.push(newPos);
				ctx.clearRect(0,0,canvas.width,canvas.height);
				sceneObject.draw(ctx);
			}
		}
	}
	document.body.onmouseup = function(e) {
		activeObject = null;
	};
	document.body.ongesturechange = function(e) {
		ctx.scale(e.scale,e.scale);
	}

	function resizeCanvas() {
		canvas.width = canvas.offsetWidth*window.devicePixelRatio;
		canvas.height = canvas.offsetHeight*window.devicePixelRatio;
		ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		sceneObject.draw(ctx);
	}
	window.onresize = resizeCanvas;
	setTimeout(resizeCanvas, 3500);
};




var dom = require('tfdom');
var tfmouseposition = require('../tfmouseposition');
var d = require('../appdata');

var canvas = null;
var ctx = null;

var isDown = false;
var leftPos = [0,0];
var rightPos = 0;
var scale = 1;

var color = null;
var rainbow = [255,0,0];

var stops = [
	[255,0,0],
	[255,0,255],
	[0,0,255],
	[0,255,255],
	[0,255,0],
	[255,255,0],
	[255,0,0]
];

(function() {
	dom.on(document.body, 'mousemove', mousemove);
	dom.on(document.body, 'mouseup', mouseup);
	dom.on(document.body, 'touchmove', mousemove);
	dom.on(document.body, 'touchend', mouseup);
})();

function clamp(x, a, b) {
	return Math.max(a, Math.min(x, b))
}

module.exports = function(c) {
	color = c;
	propertiesList.innerHTML = '';
	propertiesList.ontouchmove = null;
	canvas = dom.create('canvas', {width: propertiesList.offsetWidth, height: propertiesList.offsetHeight, parent: propertiesList});
	ctx = canvas.getContext('2d');
	canvas.onmousedown = canvas.ontouchstart = mousedown;

	refresh();
};

function refresh() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.save();
	scale = canvas.width/286;
	ctx.scale(scale,scale);
	
	var grd = ctx.createLinearGradient(0,0,0,256);
	grd.addColorStop(0,"rgb(255,0,0)");
	grd.addColorStop(1/6,"rgb(255,0,255)");
	grd.addColorStop(2/6,"rgb(0,0,255)");
	grd.addColorStop(3/6,"rgb(0,255,255)");
	grd.addColorStop(4/6,"rgb(0,255,0)");
	grd.addColorStop(5/6,"rgb(255,255,0)");
	grd.addColorStop(1,"rgb(255,0,0)");
	ctx.fillStyle = grd;
	ctx.fillRect(0,0,30,256);

	grd = ctx.createLinearGradient(30,0,286,0);
	grd.addColorStop(0,"rgba(255,255,255,1)");
	grd.addColorStop(1,"rgba("+rainbow[0]+','+rainbow[1]+','+rainbow[2]+",1)");
	ctx.fillStyle = grd;
	ctx.fillRect(30,0,256,256);
	
	grd = ctx.createLinearGradient(0,0,0,256);
	grd.addColorStop(0,"rgba(0,0,0,0)");
	grd.addColorStop(1,"rgba(0,0,0,1)");
	ctx.fillStyle = grd;
	ctx.fillRect(30,0,256,256);

	ctx.beginPath();
	ctx.arc(leftPos[0]+30,leftPos[1],4,0,2*Math.PI);
	ctx.stroke();

	ctx.strokeRect(0,rightPos-2,30,4);

	ctx.restore();
}

function position(e) {
	var pos = tfmouseposition(e, canvas);
	pos[0] /= scale;
	pos[1] /= scale;
	if (pos[0] > 30) {
		leftPos = pos;
		leftPos[0] = clamp(leftPos[0]-30, 0, 255);
		leftPos[1] = clamp(leftPos[1], 0, 255);
	} else {
		rightPos = pos[1];
		rightPos = clamp(rightPos, 0, 255);
	}

	var t = Math.floor(6*(rightPos/256));
	var p = (rightPos - (t*256/6)) / (256/6);
	color.red = Math.floor((stops[t][0]*(1-p)) + (stops[t+1][0]*p));
	color.green = Math.floor((stops[t][1]*(1-p)) + (stops[t+1][1]*p));
	color.blue = Math.floor((stops[t][2]*(1-p)) + (stops[t+1][2]*p));
	rainbow = [color.red, color.green, color.blue];

	color.red += (255-color.red) * (1-(leftPos[0]/255));
	color.green += (255-color.green) * (1-(leftPos[0]/255));
	color.blue += (255-color.blue) * (1-(leftPos[0]/255));

	color.red = Math.floor(color.red*(1-(leftPos[1]/255)));
	color.green = Math.floor(color.green*(1-(leftPos[1]/255)));
	color.blue = Math.floor(color.blue*(1-(leftPos[1]/255)));

	refresh();
}

function mousedown(e) {
	isDown = true;
	position(e);
}

function mousemove(e) {
	if (!isDown) return;
	position(e);
	d.tfplay.refresh();
}

function mouseup(e) {
	isDown = false;
	d.tfplay.refresh();
}

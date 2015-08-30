
var dom = require('tfdom');

exports.setup = function() {
	var p = this.properties;
	p.width = 1.0;
	p.points = [];
	p.offsetX = 0;
	p.offsetY = 0;

	var canvas = this.canvas = document.getElementById('canvas');
	var tempcanvas = this.tempcanvas = dom.create('canvas', {
		//'style': 'position: absolute; top: 0px; left: 0px; width: '+canvas.width/4+'px; height: '+canvas.height/4+'px; border: 1px solid red;',
		'width': canvas.width,
		'height': canvas.height
	});
	var tempcontext = this.tempcontext = tempcanvas.getContext('2d');

	//document.body.appendChild(tempcanvas);
}

exports.draw = function(ctx1) {
	var p = this.properties;
	var ctx2 = this.tempcontext;
	
	ctx2.clearRect(0,0,this.canvas.width,this.canvas.height);
	ctx2.drawImage(ctx1.canvas, p.offsetX*window.devicePixelRatio, p.offsetY*window.devicePixelRatio);

	ctx2.save();
	ctx2.scale(window.devicePixelRatio,window.devicePixelRatio);
	ctx2.lineWidth = p.width;
	ctx2.lineCap = 'round';
	ctx2.lineJoin = 'round';
	ctx2.globalCompositeOperation = 'destination-in';
	var pnts = p.points;
	ctx2.beginPath();
	if (pnts.length > 0) ctx2.moveTo(pnts[0][0],pnts[0][1]);
	for (var i=1; i<pnts.length; i++) {
		ctx2.lineTo(pnts[i][0],pnts[i][1]);
	}
	ctx2.stroke();
	ctx2.restore();

	ctx1.save();
	ctx1.scale(1/window.devicePixelRatio,1/window.devicePixelRatio);
	ctx1.drawImage(ctx2.canvas, 0, 0);
	ctx1.restore();

	ctx2.restore();
}


var dom = require('tfdom');

exports.setup = function() {
	this.properties.red = 0.3;
	this.properties.green = 0.59;
	this.properties.blue = 0.11;

	this.canvas = document.getElementById('canvas');
}

exports.draw = function(ctx, fast) {
	if (/*hasSupport || */fast) return fastdraw.call(this, ctx);
	var p = this.properties;
	var d = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
	var sz = this.canvas.width*this.canvas.height*4;
	for (var i=0; i<sz; i+=4) {
		d[i] = d[i+1] = d[i+2] = p.red*d[i] + p.green*d[i+1] + p.blue*d[i+2];
		//0.3*d[i] + 0.59*d[i+1] + 0.11*d[i+2];
		//0.34*d[i] + 0.5*d[i+1] + 0.16*d[i+2];
		//Math.floor((d[i]+d[i+1]+d[i+2])/3);
	}
	ctx.putImageData(new ImageData(d, this.canvas.width, this.canvas.height), 0, 0);
}

function fastdraw(ctx) {
	if (!hasSupport) return;
	ctx.save();
	ctx.globalCompositeOperation = 'color';
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,this.canvas.width/2,this.canvas.height/2);
	ctx.restore();
}

var hasSupport = (function() {
	var c = dom.create('canvas', {
		width: 1,
		height: 1
	});
	var ctx = c.getContext('2d');
	ctx.fillStyle = 'red';
	ctx.fillRect(0,0,1,1);
	ctx.globalCompositeOperation = 'color';
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,1,1);
	var d = ctx.getImageData(0, 0, 1, 1).data;
	return d[0] !== 255
})();

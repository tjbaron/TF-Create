
var dom = require('tfdom');

exports.setup = function() {
	var p = this.properties;
	p.width = 1.0;
	p.points = [];
	p.red = 0;

	this.canvas = dom.get('canvas');
	var tempcanvas = this.tempcanvas = dom.create('canvas', {
		'width': canvas.width,
		'height': canvas.height
	});
	var tempcontext = this.tempcontext = tempcanvas.getContext('2d');
}

exports.draw = function(ctx1, fast) {
	if (fast) return fastdraw.call(this, ctx1);
	var ctx2 = this.tempcontext;
	var zoom = 0.5;
	var p = this.properties;
	var rad = p.width/2;
	var zoomWidth = p.width/zoom;

	var img = ctx2.createImageData(this.canvas.width,this.canvas.height);
	var data = img.data;

	var pnts = p.points;

	var last = null;
	for (var i=0; i<pnts.length; i++) {
		var current = [pnts[i][0]/zoom, pnts[i][1]/zoom];
		if (i !== 0) {
			var ymin = ((last[1] < current[1] ? last[1] : current[1]) - zoomWidth);
			var ymax = ((last[1] > current[1] ? last[1] : current[1]) + zoomWidth);
			var xmin = ((last[0] < current[0] ? last[0] : current[0]) - zoomWidth);
			var xmax = ((last[0] > current[0] ? last[0] : current[0]) + zoomWidth);
			for (var y=ymin; y<ymax; y++) {
				for (var x=xmin; x<xmax; x++) {
					var d = distToSegment([x*zoom,y*zoom], pnts[i-1], pnts[i]) * zoom;
					if (d<rad) {
						var pos = (((y*this.canvas.width)+x)*4) + 3;
						var oldValue = data[pos];
						var newValue = 255-Math.floor(255*d/rad);
						if (newValue > oldValue) {
							data[pos] = newValue;
						}
					}
				}
			}
		}
		last = current;
	}
	ctx2.putImageData(img, 0, 0);

	ctx1.save();
	ctx1.scale(1/window.devicePixelRatio,1/window.devicePixelRatio);
	ctx1.drawImage(ctx2.canvas, 0, 0);
	ctx1.restore();
}

function fastdraw(ctx) {
	var p = this.properties;
	ctx.lineWidth = p.width;
	ctx.strokeStyle = 'rgb('+p.red*16+',0,0)';
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';

	var pnts = p.points;
	ctx.beginPath();
	if (pnts.length > 0) ctx.moveTo(pnts[0][0],pnts[0][1]);
	for (var i=1; i<pnts.length; i++) {
		ctx.lineTo(pnts[i][0],pnts[i][1]);
	}
	ctx.stroke();
}

function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v[0] - w[0]) + sqr(v[1] - w[1]) }
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);
  return dist2(p, [ v[0] + t * (w[0] - v[0]),
                    v[1] + t * (w[1] - v[1]) ]);
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }

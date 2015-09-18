
var vertSrc = '\
attribute vec2 a_position;\
uniform vec2 u_resolution;\
\
void main() {\
   vec2 clipSpace = (2.0*(a_position/u_resolution))-1.0;\
   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\
}\
';

var fragSrc = '\
precision mediump float;\
\
uniform vec4 u_color;\
\
void main() {\
	gl_FragColor = vec4(u_color.xyz,1);\
}\
';

module.exports = function(ctx) {
	var p = this.properties.points;
	if (p.length < 2) return;
	var lc = this.properties.lineColor;
	var canvas = document.getElementById('canvas');
	var resolution = [this.glcanvas.width, this.glcanvas.height];
	var zoom = 0.5;
	var gl = this.gl;
	var shaderProgram = setupShader(gl, p.length);

	// Pass data to vertex shader.

	var resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
	gl.uniform2f(resolutionLocation, resolution[0], resolution[1]);

	var r = 20;
	var p6 = Math.PI/24;
	// Pass data to fragment shader.
	var points = [];
	var x1, x2, x3, y1, y2, y3, xn1, yn1, xn2, yn2;
	for (var i=0; i<p.length; i++) {
		x1 = x2; x2 = x3;
		y1 = y2; y2 = y3;
		x3 = p[i][0]/zoom;
		y3 = (p[i][1]/zoom);
		if (x1 != null) {
			// figure normals...
			xn1 = xn2; yn1 = yn2;
			xn2 = y3-y1;
			yn2 = x1-x3;
			var length = Math.sqrt(xn2*xn2 + yn2*yn2);
			xn2 /= (length/20);
			yn2 /= (length/20);
			if (xn1 === undefined) {
				xn1 = y2-y1;
				yn1 = x1-x2;
				var length2 = Math.sqrt(xn1*xn1 + yn1*yn1);
				xn1 /= (length2/20);
				yn1 /= (length2/20);
			}
			points.push(x1);		points.push(y1);
			points.push(x2);		points.push(y2);
			points.push(x2+xn2);	points.push(y2+yn2);
			points.push(x1);		points.push(y1);
			points.push(x1+xn1);	points.push(y1+yn1);
			points.push(x2+xn2);	points.push(y2+yn2);

			points.push(x1);		points.push(y1);
			points.push(x2);		points.push(y2);
			points.push(x2-xn2);	points.push(y2-yn2);
			points.push(x1);		points.push(y1);
			points.push(x1-xn1);	points.push(y1-yn1);
			points.push(x2-xn2);	points.push(y2-yn2);
		}
		for (var j=0; j<48; j++) {
			var a = j*p6;
			var xa = x3 + r * Math.cos(a);
			var ya = y3 + r * Math.sin(a);
			var xb = x3 + r * Math.cos(a+p6);
			var yb = y3 + r * Math.sin(a+p6);
			points.push(x3);	points.push(y3);
			points.push(xa);	points.push(ya);
			points.push(xb);	points.push(yb);
		}
	}

	var colorLocation = gl.getUniformLocation(shaderProgram, "u_color");
	gl.uniform4fv(colorLocation, [lc.red/255,lc.green/255,lc.blue/255,lc.alpha]);

	// Draw triangles.
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	var positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

	gl.drawArrays(gl.TRIANGLES, 0, points.length/2);
}

function setupShader(gl, pnts) {
	var fragSrcGood = fragSrc
		.replace('{{pointCount}}', pnts*2)
		.replace('{{pointCount2}}', pnts*2);

	var frag = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(frag, fragSrcGood);
	gl.compileShader(frag); 
	var vert = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vert, vertSrc);
	gl.compileShader(vert); 
	
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vert);
	gl.attachShader(shaderProgram, frag);
	gl.linkProgram(shaderProgram);
	gl.useProgram(shaderProgram);
	return shaderProgram;
}

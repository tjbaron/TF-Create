
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
uniform float u_points[{{pointCount}}];\
\
float sqr(float x) { return x * x; }\
float dist2(vec2 v, vec2 w) { return sqr(v[0] - w[0]) + sqr(v[1] - w[1]); }\
float distToSegmentSquared(vec2 p, vec2 v, vec2 w) {\
  float l2 = dist2(v, w);\
  if (l2 == 0.0) {\
  	return dist2(p, v);\
  }\
  float t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;\
  if (t < 0.0) {\
  	return dist2(p, v);\
  }\
  if (t > 1.0) {\
  	return dist2(p, w);\
  }\
  return dist2(p, vec2( v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1]) ));\
}\
float distToSegment(vec2 p, vec2 v, vec2 w) { return sqrt(distToSegmentSquared(p, v, w)); }\
\
void main() {\
	float dist = 999999.0;\
	for (int i=2; i<{{pointCount2}}; i+=2) {\
		float newDist = distToSegment(vec2(gl_FragCoord.x,gl_FragCoord.y), vec2(u_points[i-2],u_points[i-1]), vec2(u_points[i],u_points[i+1]));\
		if (newDist < dist) dist = newDist;\
	}\
	if (dist<10.0) {\
		gl_FragColor = vec4(u_color.xyz,1.0-(dist/10.0));\
	} else if (dist<20.0) {\
		gl_FragColor = vec4(u_color.xyz,1);\
	} else {\
		gl_FragColor = vec4(0,0,0,0);\
	}\
}\
';

module.exports = function(ctx) {
	var p = this.properties.points;
	var lc = this.properties.lineColor;
	var canvas = document.getElementById('canvas');
	var resolution = [this.glcanvas.width, this.glcanvas.height];
	var zoom = 0.5;
	var gl = this.gl;
	var shaderProgram = setupShader(gl, p.length);//this.shaderProgram;

	/*gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);*/

	// Pass data to vertex shader.

	var resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
	gl.uniform2f(resolutionLocation, resolution[0], resolution[1]);

	// Setup polygons
	var r = 20;
	var p6 = Math.PI/24;
	// Pass data to fragment shader.
	var points = [];
	var x1, x2, y1, y2, xn1, yn1;
	for (var i=0; i<p.length; i++) {
		x1 = x2;
		y1 = y2;
		x2 = p[i][0]/zoom;
		y2 = (p[i][1]/zoom);
		if (x1 != null) {
			// figure normals...
			xn1 = y2-y1;
			yn1 = x1-x2;
			var length = Math.sqrt(xn1*xn1 + yn1*yn1);
			xn1 /= (length/20);
			yn1 /= (length/20);
			points.push(x1);		points.push(y1);
			points.push(x2);		points.push(y2);
			points.push(x2+xn1);	points.push(y2+yn1);
			points.push(x1);		points.push(y1);
			points.push(x1+xn1);	points.push(y1+yn1);
			points.push(x2+xn1);	points.push(y2+yn1);

			points.push(x1);		points.push(y1);
			points.push(x2);		points.push(y2);
			points.push(x2-xn1);	points.push(y2-yn1);
			points.push(x1);		points.push(y1);
			points.push(x1-xn1);	points.push(y1-yn1);
			points.push(x2-xn1);	points.push(y2-yn1);
		}
		for (var j=0; j<48; j++) {
			var a = j*p6;
			var xa = x2 + r * Math.cos(a);
			var ya = y2 + r * Math.sin(a);
			var xb = x2 + r * Math.cos(a+p6);
			var yb = y2 + r * Math.sin(a+p6);
			points.push(x2);	points.push(y2);
			points.push(xa);	points.push(ya);
			points.push(xb);	points.push(yb);
		}
	}

	// Pass data to fragment shader.

	var pointsLocation = gl.getUniformLocation(shaderProgram, "u_points[0]");
	var flat = [];
	var xRange = [resolution[0],0];
	var yRange = [resolution[1],0];
	for (var i=0; i<p.length; i++) {
		var x = p[i][0]/zoom;
		var y = (p[i][1]/zoom);
		flat.push(x);
		flat.push(resolution[1]-y);
		if (xRange[0] > x) xRange[0] = x;
		if (xRange[1] < x) xRange[1] = x;
		if (yRange[0] > y) yRange[0] = y;
		if (yRange[1] < y) yRange[1] = y;
	}
	xRange[0] -= 20;
	xRange[1] += 20;
	yRange[0] -= 20;
	yRange[1] += 20;
	gl.uniform1fv(pointsLocation, flat);

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

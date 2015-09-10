
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

	// Pass data to vertex shader.

	var resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
	gl.uniform2f(resolutionLocation, resolution[0], resolution[1]);

	// Pass data to fragment shader.

	var pointsLocation = gl.getUniformLocation(shaderProgram, "u_points[0]");
	var flat = [];
	for (var i=0; i<p.length; i++) {
		flat.push(p[i][0]/zoom);
		flat.push(resolution[1]-(p[i][1]/zoom));
	}
	gl.uniform1fv(pointsLocation, flat);

	var colorLocation = gl.getUniformLocation(shaderProgram, "u_color");
	gl.uniform4fv(colorLocation, [lc.red/255,lc.green/255,lc.blue/255,lc.alpha]);

	// Draw triangles.
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	var positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0, 0,
		resolution[0], 0,
		0, resolution[1],
		0, resolution[1],
		resolution[0], 0,
		resolution[0], resolution[1]]), gl.STATIC_DRAW);

	gl.drawArrays(gl.TRIANGLES, 0, 6);

	// Copy data to 2D canvas.

	ctx.save();
	ctx.scale(1/window.devicePixelRatio,1/window.devicePixelRatio);
	ctx.globalCompositeOperation = 'source-over';
	ctx.drawImage(gl.canvas, 0, 0);
	ctx.restore();
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

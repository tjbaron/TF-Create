
var vertSrc = '\
attribute vec2 a_position;\
attribute vec2 a_texCoord;\
uniform vec2 u_resolution;\
varying vec2 v_texCoord;\
\
void main() {\
   vec2 clipSpace = (2.0*(a_position/u_resolution))-1.0;\
   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\
   v_texCoord = a_texCoord;\
}\
';

var fragSrc = '\
precision mediump float;\
\
uniform sampler2D u_image;\
varying vec2 v_texCoord;\
\
void main() {\
	gl_FragColor = texture2D(u_image, v_texCoord);\
}\
';

exports.setup = function(utils) {
	var p = this.properties;
	p.image = null;
	p.scale = [1.0,1.0];

	this.glcanvas = utils.glcanvas;
	this.gl = utils.gl;

	this.shaderProgram = setupShader(this.gl);

	this.resolution = [canvas.width, canvas.height];
}

function setupShader(gl) {
	var frag = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(frag, fragSrc);
	gl.compileShader(frag); 
	var vert = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vert, vertSrc);
	gl.compileShader(vert); 
	
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vert);
	gl.attachShader(shaderProgram, frag);
	gl.linkProgram(shaderProgram);
	return shaderProgram;
}

exports.draw = function(ctx) {
	var p = this.properties;

	var resolution = this.resolution;
	var resolution2 = [p.image.width, p.image.height];
	var gl = this.gl;
	var shaderProgram = this.shaderProgram;
	gl.useProgram(shaderProgram);

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, p.image);

	var texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0,0,
		1,0,
		0,1,
		0,1,
		1,0,
		1,1]), gl.STATIC_DRAW);

	var texCoordLocation = gl.getAttribLocation(shaderProgram, "a_texCoord");
	gl.enableVertexAttribArray(texCoordLocation);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

	// Pass data to vertex shader.

	var resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
	gl.uniform2f(resolutionLocation, resolution[0], resolution[1]);

	// Draw triangles.
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	var positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0, 0,
		resolution2[0], 0,
		0, resolution2[1],
		0, resolution2[1],
		resolution2[0], 0,
		resolution2[0], resolution2[1]]), gl.STATIC_DRAW);

	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

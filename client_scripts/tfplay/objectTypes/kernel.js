
var dom = require('tfdom');

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
uniform vec2 u_textureSize;\
uniform float u_kernel[{{kernelSize}}];\
uniform float u_kernelWeight;\
varying vec2 v_texCoord;\
\
void main() {\
	vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\
	vec4 colorSum = vec4(0,0,0,0);\
	{{colorSum}}\
	gl_FragColor = {{fragColor}};\
}\
';

var withAlpha = '(colorSum / u_kernelWeight).rgba';
var withoutAlpha = 'vec4((colorSum / u_kernelWeight).rgb, texture2D(u_image, v_texCoord + onePixel * vec2(0,0)).a)';

exports.setup = function(utils) {
	this.properties.scale = 0.5;
	this.properties.offset = 0.0;
	if (this.properties.alpha === undefined) this.properties.alpha = false;

	var canvas = document.getElementById('canvas');
	console.log(utils);
	this.glcanvas = utils.glcanvas;
	this.gl = utils.gl;

	this.kernel = [-1,-1,-1,-1,8,-1,-1,-1,-1];
	this.shaderProgram = setupShader(this.gl, this.kernel.length, this.properties.alpha);

	this.resolution = [canvas.width, canvas.height];

	(function(that) {
		Object.defineProperty(that.properties, 'kernel', {
			set: function(x) {
				that.kernel = x;
				that.shaderProgram = setupShader(that.gl, x.length, that.properties.alpha);
			},
			get: function() {
				return that.kernel;
			},
			enumerable: true
		});
	})(this);
}

function setupShader(gl, matrixSize, alpha) {
	var colorSum = '';
	var matrixWidth = Math.floor(Math.pow(matrixSize,0.5));
	var r = Math.floor((matrixWidth-1)/2);
	for (var y=0; y<matrixWidth; y++) {
		for (var x=0; x<matrixWidth; x++) {
			colorSum += 'colorSum += texture2D(u_image, v_texCoord + onePixel * vec2('+(x-r)+', '+(y-r)+')) * u_kernel['+((y*matrixWidth)+x)+'];\n';
		}
	}
	var fragSrcGood = fragSrc
		.replace('{{colorSum}}', colorSum)
		.replace('{{kernelSize}}', matrixSize)
		.replace('{{fragColor}}', alpha?withAlpha:withoutAlpha);

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
	return shaderProgram;
}

exports.draw = function(ctx, fast) {
	//if (fast) return;

	var resolution = this.resolution;
	var gl = this.gl;
	var shaderProgram = this.shaderProgram;
	gl.useProgram(shaderProgram);

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.glcanvas);

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

	// Pass data to fragment shader.

	var textureSizeLocation = gl.getUniformLocation(shaderProgram, "u_textureSize");
	gl.uniform2f(textureSizeLocation, resolution[0], resolution[1]);

	var kernelLocation = gl.getUniformLocation(shaderProgram, "u_kernel[0]");
	gl.uniform1fv(kernelLocation, this.kernel);

	var kernelWeightLocation = gl.getUniformLocation(shaderProgram, "u_kernelWeight");
	gl.uniform1f(kernelWeightLocation, this.properties.scale);

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
}

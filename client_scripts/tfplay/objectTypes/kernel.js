
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

exports.setup = function() {
	this.properties.scale = 0.5;
	this.properties.offset = 0.0;
	if (this.properties.alpha === undefined) this.properties.alpha = false;
	
	var canvas = document.getElementById('canvas');
	this.glcanvas = dom.create('canvas', {
		'width': canvas.width,
		'height': canvas.height
	});
	this.gl = this.glcanvas.getContext('webgl') || this.glcanvas.getContext('experimental-webgl');

	this.kernel = [-1,-1,-1,-1,8,-1,-1,-1,-1];
	this.shaderProgram = setupShader(this.gl, this.kernel.length, this.properties.alpha);

	(function(that) {
		Object.defineProperty(that.properties, 'kernel', {
			set: function(x) {
				that.kernel = x;
				that.shaderProgram = setupShader(that.gl, x.length, that.properties.alpha);
			},
			get: function() {
				return that.kernel;
			}
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
	gl.useProgram(shaderProgram);
	return shaderProgram;
}

exports.draw = function(ctx) {
	var canvas = document.getElementById('canvas');
	var gl = this.gl;
	var shaderProgram = this.shaderProgram;

	var positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
	var texCoordLocation = gl.getAttribLocation(shaderProgram, "a_texCoord");

	// provide texture coordinates for the rectangle.
	var texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0,1,
		1,1,
		0,0,
		0,0,
		1,1,
		1,0]), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(texCoordLocation);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

	var resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
	var textureSizeLocation = gl.getUniformLocation(shaderProgram, "u_textureSize");
	var kernelLocation = gl.getUniformLocation(shaderProgram, "u_kernel[0]");
	var kernelWeightLocation = gl.getUniformLocation(shaderProgram, "u_kernelWeight");

	gl.uniform2f(resolutionLocation, 1000, 1000);
	gl.uniform2f(textureSizeLocation, 1000, 1000);
	gl.uniform1fv(kernelLocation, this.kernel);
	gl.uniform1f(kernelWeightLocation, this.properties.scale);

	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
	 0, 0,
	 1000, 0,
	 0, 1000,
	 0, 1000,
	 1000, 0,
	 1000, 1000]), gl.STATIC_DRAW);

	gl.drawArrays(gl.TRIANGLES, 0, 6);

	var data = new Uint8Array(canvas.width * canvas.height * 4);
	gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
	ctx.putImageData(new ImageData(new Uint8ClampedArray(data), canvas.width, canvas.height), 0, 0);
}


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
	gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1.0);\
}\
';

exports.setup = function() {
	var r = this.properties.radius = 15.0;
	var r2 = 2*Math.pow(r, 2);
	var canvas = document.getElementById('canvas')

	var colorSum = '';
	var matrixWidth = (r*2)+1;
	this.kernel = [];
	for (var y=0; y<matrixWidth; y++) {
		for (var x=0; x<matrixWidth; x++) {
			colorSum += 'colorSum += texture2D(u_image, v_texCoord + onePixel * vec2('+(x-r)+', '+(y-r)+')) * u_kernel['+((y*matrixWidth)+x)+'];\n';
			this.kernel.push( (1/(Math.PI*r2)) * Math.exp(-(Math.pow(x-r,2)+Math.pow(y-r,2))/r2) );
		}
	}
	var fragSrcGood = fragSrc.replace('{{colorSum}}', colorSum).replace('{{kernelSize}}', matrixWidth*matrixWidth);
	console.log(fragSrcGood);
	console.log(this.kernel);

	this.glcanvas = dom.create('canvas', {
		'width': canvas.width,
		'height': canvas.height
	});
	var gl = this.gl = this.glcanvas.getContext('webgl') || this.glcanvas.getContext('experimental-webgl');
	
	var frag = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(frag, fragSrcGood);
	gl.compileShader(frag); 
	var vert = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vert, vertSrc);
	gl.compileShader(vert); 
	
	var shaderProgram = this.shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vert);
	gl.attachShader(shaderProgram, frag);
	gl.linkProgram(shaderProgram);
	gl.useProgram(shaderProgram);
}

exports.draw = function(ctx) {
	
}

exports.postdraw = function(ctx) {
	var start = (new Date()).getTime();
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
	gl.uniform1f(kernelWeightLocation, 1);

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
	console.log((new Date()).getTime()-start);
}

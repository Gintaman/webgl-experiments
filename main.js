var canvas;
var gl = null;
var shaderProgram;
var vertexBuffer;

function loadShader(type, shaderSource) {
	let shader = gl.createShader(type);
	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("Error compiling shader" + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

function setupShaders() {
	let vertexShaderSource = document.querySelector("#vertexShader").text;
	let fragmentShaderSource = document.querySelector("#fragmentShader").text;

	let vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);
	let fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Failed to setup shaders");
	}

	gl.useProgram(shaderProgram);
	
	//webgl has fixed number of 'slots' for attributes
	//the generic attribute index identifies one of these 'slots'
	//we need to know the generic attribute index for each attribute in the vertex shader because
	//during the draw process the index is used to connect the buffer that contains the vertex data
	//with the correct attribute in the vertex shader
	//we can specify a specific index with gl.bindAttribLocation(),
	//or leave it up to webgl to figure out which index, use gl.getAttribLocation()
	//to ask which generic attribute index has been used for a certain attribute
	//so gl.getAttribLocation returns the location where the attribute aVertexPosition (defined 
	//in the vertex shader script source) has been bound to
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
}

function setupBuffers() {
	vertexBuffer = gl.createBuffer(); //create WebGLBuffer object 
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); //binds created buffer obj as the current array buffer obj
	//this tells webgl that from now on, we are working with this buffer object
	var triangleVertices = [
		0.0, 0.5, 0.0,
		-0.5, -0.5, 0.0,
		0.5, -0.5, 0.0
	];
	//writes the triangle vertices into the currently used webgl buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
	vertexBuffer.itemSize = 3; //how many components exist for each attribute
	vertexBuffer.numberOfItems = 3; //number of items (vertices) that exist in this buffer
}

function draw() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numberOfItems);
}

window.onload = function() {
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
	setupShaders();
	setupBuffers();
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	draw();
}

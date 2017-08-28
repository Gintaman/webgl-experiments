let createShader = function(gl, type, source) {
	let shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if(success) {
		return shader;
	}
	alert(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
};

let createProgram = function(gl, vertexShader, fragmentShader) {
	let program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	let success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if(success) {
		return program;
	}
	alert(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
};

let main = function() {
	let canvas = document.getElementById("canvas");
	let gl = canvas.getContext("webgl2");

	let vertexShaderSource = document.getElementById("vertexShader").text;
	let fragmentShaderSource = document.getElementById("fragmentShader").text;

	let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	let program = createProgram(gl, vertexShader, fragmentShader);

	let positionAttributeLocation = gl.getAttribLocation(program, "in_position");

	let positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	let positions = [
        -1.0, -1.0,
        -1.0, 1.0,
        1.0, 1.0,
        1.0, 1.0,
        1.0, -1.0,
        -1.0, -1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(program);
    gl.bindVertexArray(vao);
	gl.enableVertexAttribArray(positionAttributeLocation); //supply shader with buffer we set above
	let size = 2;
	let type = gl.FLOAT;
	let normalize = false;
	let stride = 0;
	let offset = 0;
	gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

	let primitiveType = gl.TRIANGLES;
	let count = 6; //3 vertices. each point tuple (0, -100) is one vertex -> one invocation of the vertex shader

	let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

	//let uRedLocation = gl.getUniformLocation(program, "u_red");
    //let uBlueLocation = gl.getUniformLocation(program, "u_blue");
    let uTimeLocation = gl.getUniformLocation(program, "u_time");
    let i = 0;
	let changeColor = function() {
		//gl.uniform1f(uRedLocation, Math.abs(Math.sin(Date.now() / 1000)));
        //gl.uniform1f(uBlueLocation, Math.abs(Math.sin(Date.now() / 1000)));
        //gl.uniform1f(uTimeLocation, Math.sin(Date.now()));
        //gl.uniform1f(uTimeLocation, Date.now() / 1000.0);
        //console.log(Date.now() / 1000.0);
        gl.uniform1f(uTimeLocation, Date.now());
        //gl.uniform1f(uTimeLocation, (i++) / 1000);
		gl.drawArrays(primitiveType, offset, count);
		requestAnimationFrame(changeColor);
	};
	changeColor();
    

};


window.onload = function() {
	main();
};

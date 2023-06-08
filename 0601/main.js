function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    alert(gl.getShaderInfoLog(shader));
  return shader;
}

export function initGL() {
  const canvas = document.getElementById("glCanvas");
  const gl = canvas.getContext("webgl2");
  const start = Date.now();

  gl.clearColor(0.3, 0.3, 0.3, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const vs = `#version 300 es
    in highp vec4 in_pos;
    out highp vec2 o_pos;

    void main()
    {
      gl_Position = in_pos;
      o_pos = in_pos.xy;
    }
  `;

  const fs = `#version 300 es
    #pragma vscode_glsllint_stage: frag;
    out highp vec4 frag_color;
    in highp vec2 o_pos;
    uniform highp float Time;

    highp float J( highp vec2 Z )
    {
      highp float n = 0.0;
      highp vec2 C, Z1;

      C.x = 0.35 + 0.1 * sin(Time * 3.0);
      C.y = 0.39 + 0.16 * sin(1.1 * Time);

      while (n < 255.0 && Z.x * Z.x + Z.y * Z.y < 4.0)
      {
        Z1.x = Z.x * Z.x - Z.y * Z.y; //0.6321
        Z1.y = Z.x * Z.y * 2.0; //0.988
        Z1.x += C.x; //1.0321
        Z1.y += C.y; //1.458
        Z = Z1;
        n++;
      }
      return n;
    }

    highp float Julia( highp vec2 Z )
    {
      highp float n; 
      highp float X0 = -2.0, Y0 = -2.0, X1 = 2.0, Y1 = 2.0;

      Z.x = gl_FragCoord.x * (X1 - X0) / 800.0 + X0; //-0.95
      Z.y = gl_FragCoord.y * (Y1 - Y0) / 600.0 + Y0; //-0.52
      n = J(Z);
      return n;
    }

    void main()
    { 
      highp float n;
      highp vec2 Z;

      Z.x = 1.0;
      Z.y = 1.0;
      n = Julia(Z);

      frag_color = vec4(n / 255.0 * (-sin(Time) * 1.1 + 0.3) * 1.6, n / 255.0 * (sin(Time / 1.65) * 3.0 + 0.3) * 2.0, n / 255.0 * 4.0 * (sin(Time + 0.3) + 0.3), 1);  
    }
  `;

  const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
  const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

  const program = gl.createProgram();
  gl.attachShader(program, vertexSh);
  gl.attachShader(program, fragmentSh);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert(gl.getProgramInfoLog(program));
  }

  const posLoc = gl.getAttribLocation(program, "in_pos");

  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);

  const x = 1;
  const pos = [-x, x, 0, -x, -x, 0, x, x, 0, x, -x, 0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(posLoc);
  gl.useProgram(program);

  const timeFromStart = Date.now() - start;
  const loc = gl.getUniformLocation(program, "Time");
  gl.uniform1f(loc, timeFromStart);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  const draw = () => {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);
    gl.useProgram(program);

    const timeFromStart = Date.now() - start;
    gl.uniform1f(loc, timeFromStart / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    window.requestAnimationFrame(draw);
  };
  draw();
}

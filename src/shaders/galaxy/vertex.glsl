uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 color;
attribute vec3 aRandom;

varying vec3 vColor;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);


    // Finish set up

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    /**
    * Size
    */
    gl_PointSize = 10.0;

    vColor = color;
}

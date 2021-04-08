uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 color;
attribute vec3 aRandom;

varying vec3 vColor;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Spin
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * (uTime) * 0.2;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    modelPosition += vec4(aRandom, 1.0);

    // Finish set up

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    /**
    * Size
    */
    gl_PointSize = uSize * aScale * (1.0 / - viewPosition.z);

    vColor = color;
}

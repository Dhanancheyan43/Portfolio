import * as THREE from 'three';

// A puffy extruded heart centred on the origin, roughly 2 units wide.
function createHeartGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -1);
  shape.bezierCurveTo(-0.3, -0.7, -1, -0.3, -1, 0.25);
  shape.bezierCurveTo(-1, 0.75, -0.5, 1, 0, 0.55);
  shape.bezierCurveTo(0.5, 1, 1, 0.75, 1, 0.25);
  shape.bezierCurveTo(1, -0.3, 0.3, -0.7, 0, -1);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.18,
    bevelSize: 0.15,
    bevelSegments: 4,
    curveSegments: 24,
  });
  geometry.center();
  return geometry;
}

export const heartGeometry = createHeartGeometry();

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

// traffic config
export const NUM_CARS = 200;

// debug flags
const SHOW_DEBUG_PATH = false; // show traffic curves

export async function loadTraffic(
    isMounted: boolean,
    sceneRef: React.MutableRefObject<THREE.Scene | undefined>,
    carInstancedMeshRef: React.MutableRefObject<THREE.InstancedMesh | null>,
    trafficCurveRef: React.MutableRefObject<THREE.Curve<THREE.Vector3> | null>,
    carProgressOffsetsRef: React.MutableRefObject<number[]>
) {
    try {
        if (isMounted && sceneRef.current) {
            // initialize random progress offsets for each car
            carProgressOffsetsRef.current = [];
            for (let i = 0; i < NUM_CARS; i++) {
                carProgressOffsetsRef.current.push(Math.random()); // random starting position
            }

            // threejs box - works better with InstancedMesh rather than blender gltf box
            const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.1);

            const material = new THREE.MeshStandardMaterial({
                color: 0xffcc66,  // yellow
                emissive: 0xffaa33,  // warm yellow glow
                emissiveIntensity: 2.0,  // strong bloom effect
                metalness: 0.3,
                roughness: 0.7
            });

            // create instanced mesh
            const instancedMesh = new THREE.InstancedMesh(
                geometry,
                material,
                NUM_CARS
            );

            // initialize all instances with identity matrix at origin
            const matrix = new THREE.Matrix4();
            for (let i = 0; i < NUM_CARS; i++) {
                matrix.identity();
                instancedMesh.setMatrixAt(i, matrix); // ith car gets this matrix
            }
            instancedMesh.instanceMatrix.needsUpdate = true; // send to gpu

            carInstancedMeshRef.current = instancedMesh;
            sceneRef.current.add(instancedMesh);

            console.log(`Created InstancedMesh with ${NUM_CARS} cars`);
        }

        // Load the traffic curve
        const loader = new GLTFLoader();
        loader.load('models/Trafficgfx/TrafficCurves/East.glb', (gltf) => {
            if (!isMounted) return;

            // Find any object with geometry (Line, LineSegments, or Mesh)
            let curveObject: THREE.Line | THREE.LineSegments | THREE.Mesh | null = null;
            gltf.scene.traverse((child: THREE.Object3D) => {
                if ((child instanceof THREE.Line || child instanceof THREE.LineSegments || child instanceof THREE.Mesh) && (child as any).geometry) {
                    // use this obj as curve
                    curveObject = child as THREE.Line | THREE.LineSegments | THREE.Mesh;
                }
            });

            if (curveObject && (curveObject as any).geometry) {
                // extract points from the geometry and apply world transform
                const geometry = (curveObject as any).geometry;
                const positions = geometry.attributes.position;
                const points: THREE.Vector3[] = [];

                // get the world matrix to transform local points to world space
                curveObject.updateMatrixWorld(true);
                const worldMatrix = curveObject.matrixWorld;

                for (let i = 0; i < positions.count; i++) {
                    const point = new THREE.Vector3(
                        positions.getX(i),
                        positions.getY(i),
                        positions.getZ(i)
                    );
                    // apply world transform to match scene position
                    point.applyMatrix4(worldMatrix);
                    points.push(point);
                }

                // create a curve from the points
                trafficCurveRef.current = new THREE.CatmullRomCurve3(points, false);
                console.log('Traffic curve loaded with', points.length, 'points');

                // draw curve path if debug flag on
                if (SHOW_DEBUG_PATH && sceneRef.current) {
                    const curvePoints = trafficCurveRef.current.getPoints(100);
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
                    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
                    const curveLine = new THREE.Line(lineGeometry, lineMaterial);
                    sceneRef.current.add(curveLine);
                }
            } else {
                console.error('Could not find Line, LineSegments, or Mesh in East.glb');
            }
        }, undefined, (error) => {
            console.error('Error loading East.glb:', error);
        });
    } catch (error) {
        console.error("Error loading traffic:", error);
    }
}

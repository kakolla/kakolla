// moving traffic with instantcedmesh (less render calls)
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

// traffic config
export const NUM_CARS_PER_LANE = 200;
const SHOW_DEBUG_PATH = false; // show traffic curves

export interface TrafficLaneRefs {
    instancedMesh: React.MutableRefObject<THREE.InstancedMesh | null>;
    curve: React.MutableRefObject<THREE.Curve<THREE.Vector3> | null>;
    progressOffsets: React.MutableRefObject<number[]>;
}

// cache for loaded curves to avoid reloading same glb multiple times
const curveCache = new Map<string, THREE.Vector3[]>();

export async function loadTrafficLane(
    curvePath: string,
    laneOffset: THREE.Vector3,
    reversed: boolean,
    laneRefs: TrafficLaneRefs,
    sceneRef: React.MutableRefObject<THREE.Scene | undefined>,
    isMounted: boolean,
    debugColor?: number
) {
    try {
        if (isMounted && sceneRef.current) {
            // initialize random progress offsets
            laneRefs.progressOffsets.current = [];
            for (let i = 0; i < NUM_CARS_PER_LANE; i++) {
                laneRefs.progressOffsets.current.push(Math.random());
            }

            // create geometry and material for cars
            const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.1);
            const material = new THREE.MeshStandardMaterial({
                color: 0xffcc66,
                emissive: 0xffaa33,
                emissiveIntensity: 2.0,
                metalness: 0.3,
                roughness: 0.7
            });

            // create instanced mesh
            const instancedMesh = new THREE.InstancedMesh(
                geometry,
                material,
                NUM_CARS_PER_LANE
            );

            const matrix = new THREE.Matrix4();
            for (let i = 0; i < NUM_CARS_PER_LANE; i++) {
                matrix.identity();
                instancedMesh.setMatrixAt(i, matrix);
            }
            instancedMesh.instanceMatrix.needsUpdate = true;

            laneRefs.instancedMesh.current = instancedMesh;
            sceneRef.current.add(instancedMesh);
        }

        // Check if curve is already cached
        if (curveCache.has(curvePath)) {
            // use cached points
            const basePoints = curveCache.get(curvePath)!;
            const points = basePoints.map(p => {
                const newPoint = p.clone();
                newPoint.add(laneOffset);
                return newPoint;
            });

            if (reversed) {
                points.reverse();
            }

            laneRefs.curve.current = new THREE.CatmullRomCurve3(points, false);

            // debug visualization
            if (SHOW_DEBUG_PATH && sceneRef.current) {
                const curvePoints = laneRefs.curve.current.getPoints(100);
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: debugColor || 0x00ff00,
                    linewidth: 2
                });
                const curveLine = new THREE.Line(lineGeometry, lineMaterial);
                sceneRef.current.add(curveLine);
            }
        } else {
            // load traffic curve for the first time
            const loader = new GLTFLoader();
            loader.load(curvePath, (gltf) => {
                if (!isMounted) return;

                let curveObject: THREE.Line | THREE.LineSegments | THREE.Mesh | null = null;
                gltf.scene.traverse((child: THREE.Object3D) => {
                    if ((child instanceof THREE.Line || child instanceof THREE.LineSegments || child instanceof THREE.Mesh) && (child as any).geometry) {
                        // if we can make a curve 
                        curveObject = child as THREE.Line | THREE.LineSegments | THREE.Mesh;
                    }
                });

                if (curveObject && (curveObject as any).geometry) {
                    const geometry = (curveObject as any).geometry;
                    const positions = geometry.attributes.position;
                    const basePoints: THREE.Vector3[] = []; // pts for the curve

                    (curveObject as THREE.Object3D).updateMatrixWorld(true);
                    const worldMatrix = (curveObject as THREE.Object3D).matrixWorld;

                    for (let i = 0; i < positions.count; i++) {
                        const point = new THREE.Vector3(
                            positions.getX(i),
                            positions.getY(i),
                            positions.getZ(i)
                        );
                        point.applyMatrix4(worldMatrix);
                        basePoints.push(point);
                    }

                    // cache the curve
                    curveCache.set(curvePath, basePoints);

                    // add offset for opposite lane
                    const points = basePoints.map(p => {
                        const newPoint = p.clone();
                        newPoint.add(laneOffset);
                        return newPoint;
                    });

                    if (reversed) {
                        points.reverse();
                    }

                    laneRefs.curve.current = new THREE.CatmullRomCurve3(points, false);
                    console.log(`traffic lane loaded with ${points.length} points, reversed: ${reversed}`);

                    // debug visualization
                    if (SHOW_DEBUG_PATH && sceneRef.current) {
                        const curvePoints = laneRefs.curve.current.getPoints(100);
                        const lineGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
                        const lineMaterial = new THREE.LineBasicMaterial({
                            color: debugColor || 0x00ff00,
                            linewidth: 2
                        });
                        const curveLine = new THREE.Line(lineGeometry, lineMaterial);
                        sceneRef.current.add(curveLine);
                    }
                } else {
                    console.error(`Could not find geometry in ${curvePath}`);
                }
            }, undefined, (error) => {
                console.error(`Error loading ${curvePath}:`, error);
            });
        }
    } catch (error) {
        console.error("Error loading traffic lane:", error);
    }
}

// Helper to animate a single lane
export function animateTrafficLane(
    laneRefs: TrafficLaneRefs,
    speed: number,
    numCars: number = NUM_CARS_PER_LANE
) {
    if (laneRefs.instancedMesh.current &&
        laneRefs.instancedMesh.current.instanceMatrix &&
        laneRefs.curve.current &&
        laneRefs.progressOffsets.current.length === numCars) {

        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3(1, 1, 1);

        for (let i = 0; i < numCars; i++) {
            // update progress
            laneRefs.progressOffsets.current[i] += speed;
            if (laneRefs.progressOffsets.current[i] > 1) {
                laneRefs.progressOffsets.current[i] = 0;
            }

            // get position on curve
            position.copy(laneRefs.curve.current.getPoint(laneRefs.progressOffsets.current[i]));

            // orientation from tangent
            const tangent = laneRefs.curve.current.getTangent(laneRefs.progressOffsets.current[i]);
            const lookAtTarget = new THREE.Vector3().copy(position).add(tangent);

            const tempMatrix = new THREE.Matrix4();
            tempMatrix.lookAt(position, lookAtTarget, new THREE.Vector3(0, 1, 0));
            quaternion.setFromRotationMatrix(tempMatrix);

            matrix.compose(position, quaternion, scale);
            laneRefs.instancedMesh.current.setMatrixAt(i, matrix);
        }

        laneRefs.instancedMesh.current.instanceMatrix.needsUpdate = true;
    }
}

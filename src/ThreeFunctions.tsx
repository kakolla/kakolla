// File for functions used in ThreeScene

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DecalGeometry } from 'three/examples/jsm/Addons.js';

export async function loadObject(path: string, scene: THREE.Scene, decalPath?: string, pos?: THREE.Vector3): Promise<THREE.Object3D> {



    return new Promise((resolve, reject) => {

        const loader = new GLTFLoader();

        const placeholder = new THREE.Object3D(); // Placeholder object

        let model;
        loader.load(path, function (gltf) {
            model = gltf.scene;
            if (pos) {
                model.position.set(pos.x, pos.y, pos.z);

            }
            model.rotation.y = Math.PI / 4;

            // if decal given
            if (decalPath) {
                // Create Decal



                // const decalPosition = new THREE.Vector3(0, 0, 0); // Position of the decal
                // const decalOrientation = new THREE.Euler(0, 0, 0); // Orientation of the decal
                // const decalSize = new THREE.Vector3(1, 1, 1); // Size of the decal


                const targetMesh = gltf.scene.getObjectByName('Cube') as THREE.Mesh;
                const bbox = new THREE.Box3().setFromObject(targetMesh);
                const center = new THREE.Vector3();
                bbox.getCenter(center); // Center of the bounding box

                console.log("center", pos);
                // const decalPosition = center; // Set decal position to the center of the mesh
                // const decalPosition = pos;
                const decalPosition = new THREE.Vector3(0, 0, 0);
                const decalOrientation = new THREE.Euler(0, Math.PI / 2, 0);
                const size = new THREE.Vector3();
                bbox.getSize(size);

                const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                const cube = new THREE.Mesh(geometry, material);


                scene.add(cube);
                // console.log(size.x);
                // console.log(size.y);
                // console.log(size.z);
                // const decalSize = new THREE.Vector3(1, 1, 1); // Adjust size as needed

                // console.log(gltf.scene)
                // console.log("geom: ", targetMesh.geometry);
                if (!targetMesh) {
                    console.error('couldnt find mesh');
                    return;
                }

                const decalMaterial = new THREE.MeshStandardMaterial({
                    map: new THREE.TextureLoader().load(decalPath),
                    transparent: true,
                });

                const decalGeometry = new DecalGeometry(
                    cube, // The model on which to project the decal
                    decalPosition, // Position of the decal
                    decalOrientation, // Pass the Euler directly

                );

                const decalMesh = new THREE.Mesh(decalGeometry, decalMaterial);


                // Add the decal mesh to the scene
                console.log('decal mesh is ' + decalMesh)
                // decalMesh.scale.set(2, size.y, size.z);
                // decalMesh.position.set(-8, 1.5, 2);
                scene.add(decalMesh);
            }


            placeholder.add(...model.children);
            console.log("Model " + path + " loaded");
            resolve(placeholder);
        }, undefined, function (error) {
            console.error(error);
            console.error("Failed to load model");
            reject("error");

        });
    });


}

export async function loadObjectWithAnimation(path: string, scene: THREE.Scene): Promise<[THREE.Object3D, THREE.AnimationMixer]> {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        const placeholder = new THREE.Object3D(); // Placeholder object

        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;
                model.rotation.y = Math.PI / 4;
                console.log("Model " + path + " loaded");
                // console.log(scene.children);

                placeholder.add(...model.children);

                // create an animation mixer
                const animMixer = new THREE.AnimationMixer(model);
                scene.add(placeholder); // add THREE.Object3D version to scene

                // play the first animation if available
                if (gltf.animations.length > 0) {
                    // important***: must pass in 2nd argument which is the THREE.Object3D
                    const action = animMixer.clipAction(gltf.animations[0], placeholder);
                    action.play();
                }

                // resolve the promise with both model and mixer
                resolve([placeholder, animMixer]);
            },
            undefined,
            (error) => {
                console.error(error);
                reject("Failed to load model");
            }
        );
    });
}

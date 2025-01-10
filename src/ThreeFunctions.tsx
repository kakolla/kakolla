// File for functions used in ThreeScene

import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export async function loadObject(path: string): Promise<THREE.Object3D> {



    return new Promise((resolve, reject) => {

        const loader = new GLTFLoader();

        const placeholder = new THREE.Object3D(); // Placeholder object

        let model;
        loader.load(path, function (gltf) {
            model = gltf.scene;
            model.rotation.y = Math.PI / 4;
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

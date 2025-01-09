// import { useState } from 'react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';


import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



// post processing
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { AnimationMixer, Clock } from "three";


function loadObject(path: string): THREE.Object3D<THREE.Object3DEventMap> {

    const loader = new GLTFLoader();

    const placeholder = new THREE.Object3D(); // Placeholder object

    let model;
    loader.load(path, function (gltf) {
        model = gltf.scene;
        model.rotation.y = Math.PI / 4;
        console.log("Model " + path + " loaded");
        placeholder.add(...model.children);
    }, undefined, function (error) {
        console.error(error);
        console.error("Failed to load model");

    });

    return placeholder;


}

async function loadObjectWithAnimation(path: string, scene: THREE.Scene): Promise<[THREE.Object3D, THREE.AnimationMixer]> {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        const placeholder = new THREE.Object3D(); // Placeholder object
        
        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;
                model.rotation.y = Math.PI / 4;
                console.log("Model " + path + " loaded");

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

function ThreeScene() {



    // set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth /
        window.innerHeight, 0.1, 2000);

    // turn on antialiasing: {antialias: true} inside WebGLRenderer()
    const renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance", antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);





    // adding controls for camera
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 4;
    camera.position.x = 0;
    camera.position.y = 2;
    controls.maxPolarAngle = Math.PI / 2; // prevent camera past ground level
    controls.enableDamping = true;
    controls.maxDistance = 10;

    // set up test cube
    // const geometry = new THREE.BoxGeometry( 1, 1, 1);
    // const material = new THREE.MeshBasicMaterial( {color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add( cube );

    // load obj
    let homeModel: THREE.Object3D = loadObject('public/home/home.gltf');
    scene.add(homeModel);


    // add particles
    const clock = new Clock(); // for animations
    let animMixer: AnimationMixer; // for now, for particle animation
    let particles: THREE.Object3D | null=null;
    

    
    // load animated particles using promise (and only once)
    useEffect(() => {
        async function loadModel() {
            try {
                [particles, animMixer] = await loadObjectWithAnimation('public/particles/scene.gltf', scene);
                scene.add(particles);
            } catch (error) {
                console.error("Error loading model with animation:", error);
            }
        }
        loadModel();
    }, []); // only run once on mount
    

    
    const light = new THREE.AmbientLight(0xffffff, 0.01);
    scene.add(light);

    const pl = new THREE.PointLight(0xffffff, 5, 3, 2);
    pl.position.set(-0.5, 2, 0);
    // const dlHelper = new THREE.PointLightHelper(dl, 1);
    scene.add(pl);


    // post processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new EffectPass(camera, new BloomEffect({intensity: 3, luminanceThreshold: .7, radius: 0.5})));

    requestAnimationFrame(function render() {

        requestAnimationFrame(render);
        composer.render();

        if (homeModel) {
            homeModel.rotation.y += 0.001;
        }
        controls.update(); // camera controls update
    });


   

    // animation loop
    function animate() {
        const deltaTime = clock.getDelta();
        if (animMixer) {
            animMixer.update(deltaTime); // Update animation mixer for particle animations
            animMixer.timeScale = 0.1;
        }

    }

    // double check if webGL is compatible (from three js docs)
    if (WebGL.isWebGL2Available()) {
        renderer.setAnimationLoop(animate);
    } else {
        const warning = WebGL.getWebGL2ErrorMessage();
        document.getElementById('root')?.appendChild(warning);
    }

    // use Ref hook to create a container that renderer.domElement (HTMLCanvasElement) can be added to
    const containerRef = useRef<HTMLDivElement>(null); // create reference to this div element (JSX Element)

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.appendChild(renderer.domElement);
        }

        // cleanup when component is deleted
        return () => {
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };

    }, []);

    console.log(window.innerWidth + 'x' + window.innerHeight);
    return <div className="" ref={containerRef}></div>;
}

export default ThreeScene;
// import { useState } from 'react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';


import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



// post processing
import { BlendFunction, BloomEffect, EffectComposer, EffectPass, NoiseTexture, RenderPass } from "postprocessing";
import { NoiseEffect } from 'postprocessing';
import { AnimationMixer, Clock } from "three";


async function loadObject(path: string): Promise<THREE.Object3D> {



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
interface Props {
    pageState: string;
    setPage: Function;
}



function ThreeScene({ pageState, setPage}: Props) {
    console.log("mounting ThreeScene component?");
    const homeModelRef = useRef<THREE.Object3D | null>(null);
    const [homeModel, setHomeModel] = useState<THREE.Object3D | null>(null);

    const sceneRef = useRef<THREE.Scene>();
    const cameraRef = useRef<THREE.Camera>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const controlsRef = useRef<OrbitControls>();

    // add particles
    const clockRef = useRef<Clock>(new Clock()); // for animations
    const animMixerRef = useRef<AnimationMixer>(); // for now, for particle animation
    const particlesRef = useRef<THREE.Object3D>();

    let composer = useRef<EffectComposer>(new EffectComposer(rendererRef.current)).current;

    
    // set up scene, camera, and renderer
    useEffect(() => {
    
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(55, window.innerWidth /
        window.innerHeight, 0.1, 2000);


    // turn on antialiasing: {antialias: true} inside WebGLRenderer()
    rendererRef.current = new THREE.WebGLRenderer({ powerPreference: "high-performance", antialias: false });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);


    addEventListener("resize", () => { rendererRef.current!.setSize(window.innerWidth, window.innerHeight); });



        
    // adding controls for camera
    controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
    cameraRef.current.position.x = 0;
    cameraRef.current.position.y = 2;
    cameraRef.current.position.z = 4;
    controlsRef.current.maxPolarAngle = Math.PI / 2; // prevent camera past ground level
    controlsRef.current.enableDamping = true;
    controlsRef.current.maxDistance = 10;

}, []);
    // set up test cube
    // const geometry = new THREE.BoxGeometry( 1, 1, 1);
    // const material = new THREE.MeshBasicMaterial( {color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add( cube );

    // load obj using hook (only once)
    useEffect(() => {
        let isMounted = true;
        async function loadHome() {
            try {
                const loadedModel = await loadObject('public/home/home.gltf');
                if (isMounted)
                {
                    sceneRef.current?.add(loadedModel);
                    setHomeModel(loadedModel);
                    homeModelRef.current = loadedModel;

                }

            } catch (error) {
                console.error("Error loading model (no animation): ", error);
            }
        }
        loadHome();

        return () => 
        {
            isMounted = false;
            // homeModel?.traverse((child) => {
                //     if ((child as any).material) {
                    //         (child as any).material.dispose();
            //     }
            //     if ((child as any).geometry) {
            //         (child as any).geometry.dispose();
            //     }
            //     if ((child as any).texture) {
            //         (child as any).texture.dispose();
            //     }
            // });
            if (homeModelRef.current){
                console.log("removing home");
                sceneRef.current?.remove(homeModelRef.current);
            }

        }
    }, []); // run once






    // load animated particles using promise (and only once)
    useEffect(() => {
        async function loadModel() {
            try {
                [particlesRef.current, animMixerRef.current] = await loadObjectWithAnimation('public/particles/scene.gltf', sceneRef.current!);
                sceneRef.current?.add(particlesRef.current);
            } catch (error) {
                console.error("Error loading model with animation:", error);
            }
        }
        loadModel();

        // cleanup
        return () => {
            if (particlesRef.current) {
                particlesRef.current.traverse((child) => {
                    if ((child as any).material) {
                        (child as any).material.dispose();
                    }
                    if ((child as any).geometry) {
                        (child as any).geometry.dispose();
                    }
                    if ((child as any).texture) {
                        (child as any).texture.dispose();
                    }
                });
                sceneRef.current?.remove(particlesRef.current);
            }
        };
    }, []); // only run once on mount



    useEffect(() => {

    
    const light = new THREE.AmbientLight(0xffffff, 0.01);
    sceneRef.current?.add(light);

    const pl = new THREE.PointLight(0xffffff, 5, 3, 2);
    pl.position.set(-0.5, 2, 0);
    // const dlHelper = new THREE.PointLightHelper(dl, 1);
    sceneRef.current?.add(pl);
}, []);


    useEffect(() => {

    
    // post processing effects
    composer = new EffectComposer(rendererRef.current);
    composer.addPass(new RenderPass(sceneRef.current, cameraRef.current));
    composer.addPass(new EffectPass(cameraRef.current, new BloomEffect({ intensity: 3, luminanceThreshold: .7, radius: 0.5 })));
    const noiseEffect = new NoiseEffect({
        blendFunction: BlendFunction.SCREEN, 
        premultiply: true,
    });
    
    noiseEffect.blendMode.opacity.value = 0.75; // control strength of effect    
    composer.addPass(new EffectPass(cameraRef.current, noiseEffect));





    requestAnimationFrame(function render() {

        requestAnimationFrame(render);
        composer.render();

        if (homeModel) {
            homeModel.rotation.y += 0.001;
        }
        controlsRef.current?.update(); // camera controls update
    });



    

    // animation loop
    function animate() {
        const deltaTime = clockRef.current.getDelta();
        if (animMixerRef.current) {
            animMixerRef.current.update(deltaTime); // Update animation mixer for particle animations
            animMixerRef.current.timeScale = 0.1;
        }

    }


    // double check if webGL is compatible (from three js docs)
    if (WebGL.isWebGL2Available()) {
        rendererRef.current!.setAnimationLoop(animate);
    } else {
        const warning = WebGL.getWebGL2ErrorMessage();
        document.getElementById('root')?.appendChild(warning);
    }
}, []);

    // use Ref hook to create a container that renderer.domElement (HTMLCanvasElement) can be added to
    const containerRef = useRef<HTMLDivElement>(null); // create reference to this div element (JSX Element)

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.appendChild(rendererRef.current!.domElement);
        }

        // cleanup when component is deleted
        return () => {
            if (containerRef.current) {
                containerRef.current.removeChild(rendererRef.current!.domElement);
            }
        };

    }, []);


    // // react to pageState changes
    // useEffect(() => {
    //     console.log("moving camera", pageState);
    //     if (!controls) return;
    //     const targetPosition = new THREE.Vector3();
    //     switch (pageState) {
    //         case "home":
    //             targetPosition.set(0, 2, 4);
    //             break;
    //         case "stuff":
    //             targetPosition.set(0, 2, 1);
    //             break;
    //         default:
    //             targetPosition.set(0, 2, 4);


    //     }

    //     camera.position.x = targetPosition.x;
    //     camera.position.y = targetPosition.y;
    //     camera.position.z = targetPosition.z;
    // }, [pageState]);

    // console.log(window.innerWidth + 'x' + window.innerHeight);
    return <div className="" ref={containerRef}></div>;
}

// export default React.memo(ThreeScene); // memo makes sure component doesn't re-render if parent re-renders unless props of this comp changes
export default ThreeScene;
// import { useState } from 'react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';


import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Object loading functions from other file
import { loadObject } from '../src/ThreeFunctions.tsx';
import { loadObjectWithAnimation } from '../src/ThreeFunctions.tsx';

// post processing
import { BlendFunction, BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { NoiseEffect } from 'postprocessing';
import { AnimationMixer, Clock } from "three";



interface Props {
    pageState: string;
    setPage: Function;
}



function ThreeScene({ pageState, setPage }: Props) {
    // refs to keep track of same references through component's life
    console.log("mounting ThreeScene component?");
    const homeModelRef = useRef<THREE.Object3D | null>(null);
    const [homeModel, setHomeModel] = useState<THREE.Object3D | null>(null);

    const sceneRef = useRef<THREE.Scene>();
    const cameraRef = useRef<THREE.Camera>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const controlsRef = useRef<OrbitControls>();

    // variables for the particle object
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
                if (isMounted) {
                    sceneRef.current?.add(loadedModel);
                    setHomeModel(loadedModel);
                    homeModelRef.current = loadedModel;

                }

            } catch (error) {
                console.error("Error loading model (no animation): ", error);
            }
        }
        loadHome();

        return () => {
            isMounted = false;
            if (homeModelRef.current) {
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


    // add lighting
    useEffect(() => {


        const light = new THREE.AmbientLight(0xffffff, 0.01);
        sceneRef.current?.add(light);

        const pl = new THREE.PointLight(0xffffff, 5, 3, 2);
        pl.position.set(-0.5, 2, 0);
        // const dlHelper = new THREE.PointLightHelper(dl, 1);
        sceneRef.current?.add(pl);
    }, []);


    // add post processing effects
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
    }, []);



    // Render loops
    useEffect(() => {
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
        requestAnimationFrame(animate);


        // double check if webGL is compatible (from three js docs)
        if (WebGL.isWebGL2Available()) {
            rendererRef.current!.setAnimationLoop(animate);
        } else {
            const warning = WebGL.getWebGL2ErrorMessage();
            document.getElementById('root')?.appendChild(warning);
        }
    }, [homeModel, cameraRef]);

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


    // react to pageState changes
    useEffect(() => {
        if (!controlsRef.current) return;
        const targetPosition = new THREE.Vector3();
        switch (pageState) {
            case "home":
                targetPosition.set(0, 2, 4);
                break;
            case "stuff":
                targetPosition.set(0, 2, 1);
                break;
            default:
                targetPosition.set(0, 2, 4);


        }
        console.log("moving camera to ", pageState, targetPosition);

        cameraRef.current!.position.y = targetPosition.y;
        cameraRef.current!.position.x = targetPosition.x;
        cameraRef.current!.position.z = targetPosition.z;
        cameraRef.current!.position.lerp(targetPosition, 0.3); // Smooth transition
        controlsRef.current.update(); // Update controls
    }, [pageState]);

    // console.log(window.innerWidth + 'x' + window.innerHeight);
    return <div className="" ref={containerRef}></div>;
}

// export default React.memo(ThreeScene); // memo makes sure component doesn't re-render if parent re-renders unless props of this comp changes
export default ThreeScene;
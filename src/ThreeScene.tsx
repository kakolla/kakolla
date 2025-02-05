// import { useState } from 'react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';


import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Object loading functions from other file
import { loadObject } from '../src/ThreeFunctions.tsx';
import { loadObjectWithAnimation } from '../src/ThreeFunctions.tsx';

// post processing
import { BlendFunction, BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { NoiseEffect } from 'postprocessing';
import { AnimationMixer, Clock } from "three";

import { DecalGeometry } from 'three/examples/jsm/Addons.js';

interface Props {
    pageState: string;
    setPage: Function;
}

import * as TWEEN from "three/addons/libs/tween.module.js";
import Projects from './Projects.tsx';


function ThreeScene({ pageState }: Props) {

    const projects = ["models/display/poster0.png", 
        "models/display/cleansweep.png", 
        "models/display/curve.png", 
        "models/display/roblox.png", 
        "models/display/scribo.png"];

    const [projCount, setProjCount] = useState<number>(0);
    const [projList] = useState<string[]>(projects); // first poster
    // refs to keep track of same references through component's life
    const homeModelRef = useRef<THREE.Object3D | null>(null);
    const [homeModel, setHomeModel] = useState<THREE.Object3D | null>(null);
    const projModelRef = useRef<THREE.Object3D | null>(null);


    const sceneRef = useRef<THREE.Scene>();
    const cameraRef = useRef<THREE.Camera>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const controlsRef = useRef<OrbitControls>();

    // variables for the particle object
    const clockRef = useRef<Clock>(new Clock()); // for animations
    const animMixerRef = useRef<AnimationMixer>(); // for now, for particle animation
    const particlesRef = useRef<THREE.Object3D>();

    // refs for decal
    const decalMeshRef = useRef<THREE.Mesh>();



    let composer = useRef<EffectComposer>(new EffectComposer(rendererRef.current)).current;



    // set up scene, camera, and renderer & project list
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
        // controlsRef.current.maxDistance = 7;
        controlsRef.current.minDistance = 3;

        // Add grid helper
        const gridHelper: THREE.GridHelper = new THREE.GridHelper(3000, 1000);
        // sceneRef.current?.add(gridHelper);

        // console.log(projList);

        // cleanup
        return () => {
            window.removeEventListener("resize", () => { rendererRef.current!.setSize(window.innerWidth, window.innerHeight); });
        }

    }, []);
    // set up test cube
    // const geometry = new THREE.BoxGeometry( 1, 1, 1);
    // const material = new THREE.MeshBasicMaterial( {color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // if (sceneRef.current)
    // {
    //     cube.position.x = -8;
    //     cube.position.y = 0;
    //     cube.position.z = 2;

    //     sceneRef.current.add( cube );
    // }


    useEffect(() => {
        console.log("Loading display object");
        let isMounted = true;
        async function loadDisplay() {
            try {
                const loadedModel = await loadObject('models/display/floor.gltf', sceneRef.current!);

                if (isMounted) {
                    sceneRef.current?.add(loadedModel);
                    loadedModel.position.set(-8, 0, 2);
                    projModelRef.current = loadedModel;

                    const decalPath = projList[projCount];

                    const decalPosition = new THREE.Vector3(0, 0, 0);
                    const decalOrientation = new THREE.Euler(0, Math.PI / 2, 0);
                    const geometry = new THREE.BoxGeometry(0.1, 2.25, 4);
                    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
                    const cube = new THREE.Mesh(geometry, material);
                    cube.position.set(-8, 1.5, 2);
                    sceneRef.current!.add(cube);
                    const decalMaterial = new THREE.MeshStandardMaterial({
                        map: new THREE.TextureLoader().load(decalPath),
                        transparent: true,
                    });

                    const decalGeometry = new DecalGeometry(
                        cube, // The model on which to project the decal
                        decalPosition, // Position of the decal
                        decalOrientation, // Pass the Euler directly

                    );

                    decalMeshRef.current = new THREE.Mesh(decalGeometry, decalMaterial);


                    // Add the decal mesh to the scene
                    console.log('decal mesh is ' + decalMeshRef.current)
                    decalMeshRef.current.scale.set(2, 2.2, 3.911);
                    decalMeshRef.current.position.set(-8, 1.5, 2);
                    sceneRef.current!.add(decalMeshRef.current);

                }
            } catch (error) {
                console.log("Error loading model");
            }
        }
        loadDisplay();

        // cleanup function
        return () => {
            isMounted = false;
            if (projModelRef.current) {
                console.log("Removing display object");
                sceneRef.current?.remove(projModelRef.current);

            }
            sceneRef.current?.remove(decalMeshRef.current!)

        }




    }, [projCount]);

    // load Toronto object using hook (only once)
    useEffect(() => {
        let isMounted = true;
        async function loadHome() {
            try {
                const loadedModel = await loadObject('models/toronto/toronto.gltf', sceneRef.current!);
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
                [particlesRef.current, animMixerRef.current] = await loadObjectWithAnimation('models/particles/scene.gltf', sceneRef.current!);
                sceneRef.current?.add(particlesRef.current);
            } catch (error) {
                console.error("Error loading particle model with animation:", error);
            }
        }
        loadModel();

        // cleanup
        return () => {
            if (particlesRef.current) {
                console.log("Removing particles object");
                sceneRef.current?.remove(particlesRef.current);
            }
        };
    }, []); // only run once on mount


    // add lighting
    useEffect(() => {


        // const light = new THREE.AmbientLight(0xffffff, 4);
        // const light = new THREE.AmbientLight(0xffffff, 0.01);
        // sceneRef.current?.add(light);

        const pl = new THREE.PointLight(0xffffff, 0.2, 50, 0.2);
        pl.position.set(0, 20, 0);
        // const dlHelper = new THREE.PointLightHelper(pl, 1);
        sceneRef.current?.add(pl);

        const plDisplay = new THREE.PointLight(0xffffff, 5, 4, 0.1);
        plDisplay.position.set(-7, 3.5, 2);
        // const dlHelper = new THREE.PointLightHelper(plDisplay, 1);

        sceneRef.current?.add(plDisplay);
    }, []);


    // add post processing effects
    useEffect(() => {


        // post processing effects
        composer = new EffectComposer(rendererRef.current);
        composer.addPass(new RenderPass(sceneRef.current, cameraRef.current));
        composer.addPass(new EffectPass(cameraRef.current, new BloomEffect({ intensity: 1, luminanceThreshold: .7, radius: 0.5 })));
        const noiseEffect = new NoiseEffect({
            blendFunction: BlendFunction.SCREEN,
            premultiply: true,
        });

        noiseEffect.blendMode.opacity.value = 0.90; // control strength of effect    
        composer.addPass(new EffectPass(cameraRef.current, noiseEffect));
    }, []);




    // Render loops
    useEffect(() => {
        requestAnimationFrame(function render() {

            requestAnimationFrame(render);
            composer.render();

            // if (homeModel) {
                // homeModel.rotation.y += 0.001;
            // }
            controlsRef.current?.update(); // camera controls update
        });

        // animation loop
        function animate() {
            const deltaTime = clockRef.current.getDelta();
            if (animMixerRef.current) {
                animMixerRef.current.update(deltaTime); // Update animation mixer for particle animations
                animMixerRef.current.timeScale = 0.1;
            }

            TWEEN.update();
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
        // positions for the orbit camera
        switch (pageState) {
            case "home":
                targetPosition.set(0, 0.5, 0);
                break;
            case "about":
                targetPosition.set(0, 0, 0);
                break;
            case "stuff":
                targetPosition.set(-8, 1.5, 2);
                break;
            default:
                targetPosition.set(0, 0, 0);


        }
        // console.log("Smoothly moving camera to ", pageState, targetPosition);

        const startTarget = controlsRef.current.target.clone();
        const duration = 2000;
        const startTime = performance.now();

        // quadratic ease function for smoothening
        function ease(t: number) {

            // first half (0.5 s) ease in
            // second hald (>0.5 s ) ease out
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        // tween function to quadratically end when zooming in
        // TWEEN.update() must run in animation loop
        function tween(inout: boolean) { // in - true, out - false
            console.log("Tweening");
            let desiredDistance = inout ? controlsRef.current!.minDistance : 7;

            let dir = new THREE.Vector3();
            cameraRef.current!.getWorldDirection(dir);
            dir.negate();
            let dist = controlsRef.current!.getDistance();

            new TWEEN.Tween({ val: dist })
                .to({ val: desiredDistance }, 2000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(val => {
                    cameraRef.current!.position.copy(controlsRef.current!.target).addScaledVector(dir, val.val);
                })
                .start();
        }

        function travelTowardsAnimation() {
            const elapsed = performance.now() - startTime;
            let t = Math.min(elapsed / duration, 1); // normalized time from 0 to 1
            t = ease(t);

            controlsRef.current!.target.lerpVectors(startTarget, targetPosition, t);
            controlsRef.current!.update();
            if (t < 1) {
                requestAnimationFrame(travelTowardsAnimation);
            }
            else {
                // zoom in to min distance on the stuff (project) page
                if (pageState === "stuff") {
                    tween(true);
                }
            }


        }

        travelTowardsAnimation();


    }, [pageState]);

    // useEffect(() => {
    //     if (pageState == "stuff") {
    //         console.log("showing lights");

    //     }


    // }, [pageState]);

    function nextProject() {
        if (projCount === projList.length - 1) return;
        setProjCount(projCount + 1);

    }
    function prevProject() {
        if (projCount === 0) return;
        setProjCount(projCount - 1);

    }


    // component return statement
    return <div className="" ref={containerRef}>

        {
            pageState === "stuff" &&
            <>
                <button className="animate-fade absolute text-white bottom-12 left-2/3 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] "
                    onClick={nextProject}>
                    Next
                </button>
                <button className="animate-fade absolute text-white bottom-12 right-2/3 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                    onClick={prevProject}>
                    Prev
                </button>
                <Projects projCount={projCount} />
            </>
        }
    </div>;
}

// export default React.memo(ThreeScene); // memo makes sure component doesn't re-render if parent re-renders unless props of this comp changes
export default ThreeScene;
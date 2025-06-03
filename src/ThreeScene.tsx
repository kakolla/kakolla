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

// Responsive design lib
import { useMediaQuery } from "react-responsive";

// import { DecalGeometry } from 'three/examples/jsm/Addons.js';

interface Props {
    pageState: string;
    setPage: Function;
    setEndLoadingScreen: Function;
}

import * as TWEEN from "three/addons/libs/tween.module.js";
import Projects from './Projects.tsx';


function ThreeScene({ pageState, setEndLoadingScreen }: Props) {
    // Hook to check if on mobile
    const isMobile: Boolean = useMediaQuery({ maxWidth: 767});

    const projects = ["models/display/poster0.png",
        "models/display/cleansweep.png",
        "models/display/curve.png",
        "models/display/roblox.png",
        "models/display/slice.png",
        "models/display/somas.png",
        "models/display/scribo.png"];

    const [projCount, setProjCount] = useState<number>(0);
    const [projList] = useState<string[]>(projects); // first poster
    // refs to keep track of same references through component's life
    const homeModelRef = useRef<THREE.Object3D | null>(null);
    const [homeModel, setHomeModel] = useState<THREE.Object3D | null>(null);
    const projModelRef = useRef<THREE.Object3D | null>(null);


    const sceneRef = useRef<THREE.Scene>();
    const cameraRef = useRef<THREE.PerspectiveCamera>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const controlsRef = useRef<OrbitControls>();

    // variables for the particle object
    const clockRef = useRef<Clock>(new Clock()); // for animations
    const animMixerRef = useRef<AnimationMixer>(); // for now, for particle animation
    const particlesRef = useRef<THREE.Object3D>();

    // refs for decal
    const decalPlaneRef = useRef<THREE.Mesh>();
    const texturesListRef = useRef<THREE.Texture[]>([]);


    // for post processing
    let composer = useRef<EffectComposer>(new EffectComposer(rendererRef.current)).current;

    // Dict for max orbital control distances for each page
    let pageStateMaxDistances: {
        home: number,
        stuff: number,
        about: number
    } = {
        home: 80,
        stuff: 0,
        about: 30
    };

    // camera positions for Desktop
    let pageStateCamPositions: {
        home: THREE.Vector3,
        stuff: THREE.Vector3,
        about: THREE.Vector3,
    } = {
        home: new THREE.Vector3(0, 0, 0),
        stuff: new THREE.Vector3(-37, 6, 18),
        about: new THREE.Vector3(-10, 10, -50)

    }

    // camera positions for Mobile
    let pageStateCamPositionsMobile: {
        home: THREE.Vector3,
        stuff: THREE.Vector3,
        about: THREE.Vector3,
    } = {
        home: new THREE.Vector3(0, 0, 0), // unchanged
        stuff: new THREE.Vector3(-37, 6, 18.5),
        about: new THREE.Vector3(-10, 10, -50) // unchanged

    }


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
        cameraRef.current.position.x = -20;
        cameraRef.current.position.y = 20;
        cameraRef.current.position.z = 65;
        cameraRef.current.updateProjectionMatrix();

        controlsRef.current.maxPolarAngle = Math.PI / 2; // prevent camera past ground level
        controlsRef.current.enableDamping = true;
        controlsRef.current.minDistance = 1.7;
        controlsRef.current.target.set(50, -50, 0);
        controlsRef.current.panSpeed = 0.8;
        controlsRef.current.maxDistance = 2000;
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 0.02;
        

        // Add grid helper
        // const gridHelper: THREE.GridHelper = new THREE.GridHelper(3000, 1000);
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
        // load textures
        let decalTexture: THREE.Texture;
        let decalPath: string;
        for (let i = 0; i < projList.length; i++) {
            decalPath = projList[i];
            decalTexture = new THREE.TextureLoader().load(decalPath);
            texturesListRef.current.push(decalTexture);
        }
        console.log("Finished loading project images.");

        // cleanup
        return () => {
            texturesListRef.current.forEach(texture => texture.dispose());
            texturesListRef.current = [];
        }
    }, []);
    useEffect(() => {
        console.log("Loading display object");
        let isMounted = true;
        async function loadDisplay() {
            try {
                // const loadedModel = await loadObject('models/display/floor.gltf', sceneRef.current!);

                if (isMounted) {
                    // sceneRef.current?.add(loadedModel);
                    // loadedModel.position.set(-8, 0, 2);
                    // projModelRef.current = loadedModel;


                    const geometry = new THREE.BoxGeometry(0.05, 1, 1.778);
                    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
                    const cube = new THREE.Mesh(geometry, material);
                    cube.position.set(-37, 6, 18.5);
                    cube.rotation.y += 0.3;
                    sceneRef.current!.add(cube);

                    // const decalTexture = new THREE.TextureLoader().load(decalPath);
                    const decalTexture = texturesListRef.current[projCount];

                    // Create the material for the decal
                    const decalMaterial = new THREE.MeshStandardMaterial({
                        map: decalTexture,
                        transparent: true,
                    });

                    // define the plane size 
                    const planeGeometry = new THREE.PlaneGeometry(1.778,1);  // Adjust size as needed

                    // define plane ref
                    decalPlaneRef.current = new THREE.Mesh(planeGeometry, decalMaterial);

                    // set position
                    decalPlaneRef.current.position.set(cube.position.x-0.03, cube.position.y, cube.position.z+0.02);

                    // rptate plane
                    decalPlaneRef.current.rotation.set(0, 0.3+3*(Math.PI)/2, 0); // Adjust rotation as needed

                    // add to scene
                    sceneRef.current!.add(decalPlaneRef.current);



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
            sceneRef.current?.remove(decalPlaneRef.current!)

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
                    setEndLoadingScreen(true); 

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
                particlesRef.current.scale.set(0.5,0.5,0.5); // NOT OPTIMAL but wtv for now
                particlesRef.current.position.set(-37, 6, 18.5);
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

        // display light
        const pl = new THREE.PointLight(0xffffff, 6, 5, 3);
        pl.position.set(-38, 7, 19);
        // const dlHelper = new THREE.PointLightHelper(pl, 1);
        sceneRef.current?.add(pl);


        const plGlobal = new THREE.PointLight(0xffffff, 0.8, 50, 0.2);
        plGlobal.position.set(0, 20, 0);
        sceneRef.current?.add(plGlobal);

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
            // homeModel.rotation.y += 0.0002;
            // }
            // controlsRef.current!.autoRotate = true;
            // controlsRef.current!.autoRotateSpeed = 0.05;
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
        let targetPosition = new THREE.Vector3();
        // positions for the orbit camera
        switch (pageState) {
            case "home":
                controlsRef.current.autoRotate = true;
                controlsRef.current.minDistance = 65;
                // cameraRef.current!.position.set(-20, 20, 65);
                // targetPosition.set(0, 0.5, 0);
                targetPosition = pageStateCamPositions[pageState as keyof typeof pageStateCamPositions];
                break;
            case "stuff":
                controlsRef.current.autoRotate = false;
                if (!isMobile) {
                    controlsRef.current.minDistance = 1.7;
                    targetPosition = pageStateCamPositions[pageState as keyof typeof pageStateCamPositions];
                } else {
                    console.log("Mobile");
                    controlsRef.current.minDistance = 4;
                    targetPosition = pageStateCamPositionsMobile[pageState as keyof typeof pageStateCamPositions];

                }
                // cameraRef.current!.position.set(-37, 10, 18.5);
                // cameraRef.current!.lookAt(0, 0, 0);
                break;
            case "about":
                controlsRef.current.minDistance = 8;
                controlsRef.current.autoRotate = true;
                targetPosition = pageStateCamPositions[pageState as keyof typeof pageStateCamPositions];
                break;
            default:
                controlsRef.current.autoRotate = true;
                targetPosition.set(0, 0, 0);
                break;


        }
        // console.log("Smoothly moving camera to ", pageState, targetPosition);

        const startTarget = controlsRef.current.target.clone();
        // console.log('target is!', startTarget)
        const duration = 2000;
        const startTime = performance.now();

        // quadratic ease function for smoothening
        function ease(t: number) {

            // first half (0.5 s) ease in
            // second hald (>0.5 s ) ease out
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }



        function travelTowardsAnimation(newMaxDistance: number) {
            const elapsed = performance.now() - startTime;
            let t = Math.min(elapsed / duration, 1);
            t = ease(t);

            // interpolate camera target position
            controlsRef.current!.target.lerpVectors(startTarget, targetPosition, t);

            // interpolate maxDistance smoothly if it's not the homepage
            // would error since homepage has no maxDistance defined
            if (newMaxDistance != -1) {
                controlsRef.current!.maxDistance += (newMaxDistance - controlsRef.current!.maxDistance) * 0.02;
            }
            controlsRef.current!.update();


            if (t < 1) {
                requestAnimationFrame(() => travelTowardsAnimation(newMaxDistance));
            } else {
                // this asserts that the string pageState is definitely one of the keys in the dict
                controlsRef.current!.maxDistance = pageStateMaxDistances[
                    pageState as keyof typeof pageStateMaxDistances];

                // ending target position (where camera looks at)
                if (pageState === "stuff") {
                    // cameraRef.current!.lookAt(-37, 6, 18.5);
                    if (!isMobile) {
                        controlsRef.current!.target = (pageStateCamPositions[pageState as keyof typeof pageStateCamPositions]);
                    } else {
                        controlsRef.current!.target = targetPosition = pageStateCamPositionsMobile[pageState as keyof typeof pageStateCamPositions];
                    }
                    cameraRef.current!.position.set(-50, 8, 21);
                    controlsRef.current!.update();
                }
            }
        }
        // when home is loaded, maxDistance hasn't been initialized (otherwise it would 
        // cause abrupt movement)
        if (pageState != "home") {
            travelTowardsAnimation(pageStateMaxDistances[
                pageState as keyof typeof pageStateMaxDistances]);
        }
        else {
            travelTowardsAnimation(-1);
        }


    }, [pageState]);




    // component return statement
    return <div className="" ref={containerRef}>
        {
            pageState === "stuff" &&
            <>
                <Projects projCount={projCount} setProjCountFunction={setProjCount}/>
            </>
        }
    </div>;
}

// export default React.memo(ThreeScene); // memo makes sure component doesn't re-render if parent re-renders unless props of this comp changes
export default ThreeScene;
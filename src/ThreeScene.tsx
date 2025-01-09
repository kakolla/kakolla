// import { useState } from 'react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';


import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


function loadObject(path: string) : THREE.Object3D<THREE.Object3DEventMap>  {

    const loader = new GLTFLoader();
    
    const placeholder = new THREE.Object3D(); // Placeholder object

    let model;
    loader.load(path, function ( gltf ) {
        model = gltf.scene;
        model.rotation.y = Math.PI / 4;
        console.log("Model " + path + " loaded");
        placeholder.add(...model.children);
    }, undefined, function ( error ) {
        console.error( error );
        console.error("Failed to load model");

    } );  

    return placeholder;


}

function ThreeScene() {
    
    

    // set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 55, window.innerWidth / 
        window.innerHeight, 0.1, 2000 );
    
    // turn on antialiasing: {antialias: true} inside WebGLRenderer()
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.setPixelRatio( window.devicePixelRatio );

    
    

    
    // adding controls for camera
    const controls = new OrbitControls( camera, renderer.domElement);
    camera.position.z = 4;
    camera.position.x = 0;
    camera.position.y = 2;
    controls.maxPolarAngle  = Math.PI/2; // prevent camera past ground level

    // set up test cube
    // const geometry = new THREE.BoxGeometry( 1, 1, 1);
    // const material = new THREE.MeshBasicMaterial( {color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add( cube );

    // load obj
    let homeModel: THREE.Object3D = loadObject('public/home/home.gltf');
    scene.add(homeModel);    

    const light = new THREE.AmbientLight( 0xffffff, 0.01);
    scene.add(light);

    const dl = new THREE.PointLight( 0xffffff, 3, 3, 2);
    dl.position.set(1.3, 1.8, 0);
    // const dlHelper = new THREE.PointLightHelper(dl, 1);
    scene.add(dl);



    


    // animation loop
    function animate() {

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        renderer.setSize(vw, vh);
        renderer.render(scene, camera);
        if (homeModel)
        {
            homeModel.rotation.y += 0.001;
        }
        controls.update(); // camera controls update
    }

    // double check if webGL is compatible (from three js docs)
    if (WebGL.isWebGL2Available() ) {
        renderer.setAnimationLoop( animate );
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
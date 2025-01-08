// import { useState } from 'react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';


import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function ThreeScene() {
    
    

    // set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / 
        window.innerHeight, 0.1, 1000 );
    
    // turn on antialiasing: {antialias: true} inside WebGLRenderer()
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.setPixelRatio( window.devicePixelRatio );

    // const src = renderer.domElement.toDataURL();

    // add and render to document
    // document.body.appendChild( renderer.domElement);
    
    // set up test cube
    const geometry = new THREE.BoxGeometry( 1, 1, 1);
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add( cube );
    camera.position.z = 10;
    camera.position.x = 0;
    camera.position.y = 7;

    

    
    // create line
    // const material = new THREE.LineBasicMaterial( { color: 0x0000ff });
    // const points = [];
    // points.push(new THREE.Vector3( -10, 0, 0));
    // points.push(new THREE.Vector3( 0, 10, 0));
    // points.push(new THREE.Vector3( 10, 0, 0));
    
    // const geometry = new THREE.BufferGeometry().setFromPoints( points);
    // const line = new THREE.Line( geometry, material);
    // scene.add(line);

    // load obj
    const loader = new GLTFLoader();
    let model: THREE.Object3D | null = null;
    loader.load( 'public/test/scene.gltf', function ( gltf ) {
        model = gltf.scene;
        // model.scale.set(2, 2, 2);
        model.rotation.y = Math.PI / 4;
        scene.add( gltf.scene );
        console.log("Model loaded");
    }, undefined, function ( error ) {
        console.error( error );
    } );    

    const light = new THREE.AmbientLight( 0xffffff, 0.1);
    scene.add(light);

    const dl = new THREE.DirectionalLight( 0xffdd40, 3);
    dl.position.set(3, 7, 0);
    const dlHelper = new THREE.DirectionalLightHelper(dl, 3);
    scene.add(dl, dlHelper);

    // adding controls for camera
    const controls = new OrbitControls( camera, renderer.domElement);

    


    

    // animation loop
    function animate() {
        // renderer.setSize( window.innerWidth, window.innerHeight);

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        renderer.setSize(vw, vh);
        renderer.render(scene, camera);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        if (model)
        {
            model.rotation.y += 0.001;
            model.scale.set(0.3, 0.3, 0.3);
        }
        controls.update();

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
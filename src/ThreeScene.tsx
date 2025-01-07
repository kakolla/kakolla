// import { useState } from 'react';
import * as THREE from 'three';

function ThreeScene() {
    

    // set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / 
        window.innerHeight, 0.1, 1000 );
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight);

    // const src = renderer.domElement.toDataURL();

    // add and render to document
    document.body.appendChild( renderer.domElement);
    
    // set up test cube
    const geometry = new THREE.BoxGeometry( 1, 1, 1);
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add( cube );
    camera.position.z = 5;


    // animation loop
    function animate() {
        renderer.render(scene, camera);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
    renderer.setAnimationLoop( animate );




    return (
        <></>
    );
}

export default ThreeScene;
// import { useState } from 'react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';


function ThreeScene() {
    
    

    // set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / 
        window.innerHeight, 0.1, 1000 );
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight);

    // const src = renderer.domElement.toDataURL();

    // add and render to document
    // document.body.appendChild( renderer.domElement);
    
    // set up test cube
    const geometry = new THREE.BoxGeometry( 1, 1, 1);
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add( cube );
    camera.position.z = 10;


    

    
    // create line
    // const material = new THREE.LineBasicMaterial( { color: 0x0000ff });
    // const points = [];
    // points.push(new THREE.Vector3( -10, 0, 0));
    // points.push(new THREE.Vector3( 0, 10, 0));
    // points.push(new THREE.Vector3( 10, 0, 0));
    
    // const geometry = new THREE.BufferGeometry().setFromPoints( points);
    // const line = new THREE.Line( geometry, material);
    // scene.add(line);
    

    // animation loop
    function animate() {
        renderer.render(scene, camera);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    // double check if webGL is compatible (from three js docs)
    if (WebGL.isWebGL2Available() ) {
        renderer.setAnimationLoop( animate );
    } else {
        const warning = WebGL.getWebGL2ErrorMessage();
        document.getElementById('root')?.appendChild(warning);
    }

    // use Ref hook to create a container that renderer.domElement (HTMLCanvasElement) can be added to
    const containerRef = useRef<HTMLDivElement>(null); // creates reference to this div element (JSX Element)

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


    return <div className="-my-5 absolute t-10 w-100 z-100" ref={containerRef}></div>;
}

export default ThreeScene;
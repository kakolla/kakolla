import * as THREE from 'three';

export interface SnowSystem {
    particles: THREE.Points;
    update: (delta: number) => void;
    dispose: () => void;
}

export function createSnowEffect(isMobile: boolean = false): SnowSystem {
    // reduce particle count on mobile 
    const particleCount = isMobile ? 3000 : 6000;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // snow boundary
    const spawnAreaSize = 150;
    const spawnHeight = 40;
    const minHeight = 0; 
     
    // write particle positions, velocities, and sizes
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Random position within spawn area
        positions[i3] = (Math.random() - 0.5) * spawnAreaSize;
        positions[i3 + 1] = Math.random() * spawnHeight + minHeight;
        positions[i3 + 2] = (Math.random() - 0.5) * spawnAreaSize;

        // Velocity: falling speed with slight horizontal drift
        velocities[i3] = (Math.random() - 0.5) * 0.05; // x movement 
        velocities[i3 + 1] = -(Math.random() * 0.08 + 0.02); // falling speed 
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.05; // z 

        // random size
        sizes[i] = Math.random() * 0.15 + 0.03;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Simple, performant material - no texture needed for tiny specs
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);

    // update function to animate particles (called in threescene render loop)
    function update(delta: number) {
        const positions = geometry.attributes.position.array as Float32Array;
        const velocities = geometry.attributes.velocity.array as Float32Array;

        // each particle
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // apply velocity
            positions[i3] += velocities[i3] * delta * 30;
            positions[i3 + 1] += velocities[i3 + 1] * delta * 30;
            positions[i3 + 2] += velocities[i3 + 2] * delta * 30;

            // loop particle to top once it passes floor
            if (positions[i3 + 1] < minHeight) {
                positions[i3] = (Math.random() - 0.5) * spawnAreaSize;
                positions[i3 + 1] = spawnHeight;
                positions[i3 + 2] = (Math.random() - 0.5) * spawnAreaSize;
            }

            if (Math.abs(positions[i3]) > spawnAreaSize / 2) {
                positions[i3] = -Math.sign(positions[i3]) * spawnAreaSize / 2;
            }
            if (Math.abs(positions[i3 + 2]) > spawnAreaSize / 2) {
                positions[i3 + 2] = -Math.sign(positions[i3 + 2]) * spawnAreaSize / 2;
            }
        }

        geometry.attributes.position.needsUpdate = true; // gpu re-render call
    }

    // cleanup function
    function dispose() {
        geometry.dispose();
        material.dispose();
    }

    return {
        particles,
        update,
        dispose
    };
}

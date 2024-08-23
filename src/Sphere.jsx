import React, { useEffect } from 'react';
import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat';
import getStarfield from './getStarfield';
import PropTypes from 'prop-types';

function Sphere({ scene }) {
    useEffect(() => {
        const detail = 12;

        // Create Earth group
        const earthGroup = new THREE.Group();
        earthGroup.rotation.z = -23.4 * Math.PI / 180; // Earth's axial tilt
        scene.add(earthGroup);

        const loader = new THREE.TextureLoader();

        // Create Earth geometry and materials
        const geometry = new THREE.IcosahedronGeometry(1, detail);
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: loader.load("./textures/00_earthmap1k.jpg"),
            specularMap: loader.load("./textures/02_earthspec1k.jpg"),
            bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
            bumpScale: 0.04,
        });
        const earthMesh = new THREE.Mesh(geometry, earthMaterial);
        earthGroup.add(earthMesh);

        const lightsMat = new THREE.MeshBasicMaterial({
            map: loader.load("./textures/03_earthlights1k.jpg"),
            blending: THREE.AdditiveBlending,
        });
        const lightsMesh = new THREE.Mesh(geometry, lightsMat);
        earthGroup.add(lightsMesh);

        const cloudsMat = new THREE.MeshStandardMaterial({
            map: loader.load("./textures/04_earthcloudmap.jpg"),
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
        });
        const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
        cloudsMesh.scale.setScalar(1.003);
        earthGroup.add(cloudsMesh);

        const fresnelMat = getFresnelMat();
        const glowMesh = new THREE.Mesh(geometry, fresnelMat);
        glowMesh.scale.setScalar(1.01);
        earthGroup.add(glowMesh);

        const stars = getStarfield({ numStars: 2000 });
        scene.add(stars);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(-2, 0.5, 1.5);
        scene.add(sunLight);

        // Animation function to rotate the sphere and its layers
        const animate = () => {
            requestAnimationFrame(animate);
            earthMesh.rotation.y += 0.002;
            lightsMesh.rotation.y += 0.002;
            cloudsMesh.rotation.y += 0.0023;
            glowMesh.rotation.y += 0.002;
            stars.rotation.y -= 0.0002;
        };

        animate();

        // Cleanup when the component is unmounted
        return () => {
            scene.remove(earthGroup);
            scene.remove(stars);
            scene.remove(sunLight);

            geometry.dispose();
            earthMaterial.dispose();
            lightsMat.dispose();
            cloudsMat.dispose();
            fresnelMat.dispose();
        };
    }, [scene]);

    return null;
}

Sphere.propTypes = {
    scene: PropTypes.object.isRequired,
};

export default Sphere;
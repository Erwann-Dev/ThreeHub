import { useEffect } from 'react';
import * as THREE from 'three';
import { getFresnelMat } from './utils/getFresnelMat';
import getStarfield from './utils/getStarfield';
import PropTypes from 'prop-types';
import EarthMap from './assets/textures/00_earthmap1k.jpg';
import EarthSpec from './assets/textures/02_earthspec1k.jpg';
import EarthBump from './assets/textures/01_earthbump1k.jpg';
import EarthLights from './assets/textures/03_earthlights1k.jpg';
import EarthClouds from './assets/textures/04_earthcloudmap.jpg';
import EarthCloudsTrans from './assets/textures/05_earthcloudmaptrans.jpg';


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
            map: loader.load(EarthMap),
            specularMap: loader.load(EarthSpec),
            bumpMap: loader.load(EarthBump),
            bumpScale: 0.04,
        });
        const earthMesh = new THREE.Mesh(geometry, earthMaterial);
        earthGroup.add(earthMesh);

        const lightsMat = new THREE.MeshBasicMaterial({
            map: loader.load(EarthLights),
            blending: THREE.AdditiveBlending,
        });
        const lightsMesh = new THREE.Mesh(geometry, lightsMat);
        earthGroup.add(lightsMesh);

        const cloudsMat = new THREE.MeshStandardMaterial({
            map: loader.load("EarthClouds"),
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            alphaMap: loader.load(EarthCloudsTrans),
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
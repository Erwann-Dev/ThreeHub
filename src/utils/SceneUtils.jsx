import * as THREE from 'three';

export const setupScene = () => {
    const scene = new THREE.Scene();
    return scene;
};

export const setupCamera = (width, height, groundHeight, roomWidth) => {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, groundHeight, roomWidth / 2 - 1);
    return camera;
};

export const setupRenderer = (width, height, mountRef) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    return renderer;
};
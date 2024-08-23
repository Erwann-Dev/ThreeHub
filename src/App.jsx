import { useEffect, useRef, useState } from 'react';
import './App.css';
import * as THREE from 'three';
import Room from './Room.jsx';
import Sphere from './Sphere.jsx';

function App() {
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const [texture, setTexture] = useState(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const rotationSpeed = 0.005; // Adjust this for faster/slower rotation
    const moveSpeed = 0.3; // Adjust this for faster/slower movement
    const groundHeight = 0; // The height of the camera from the ground
    const lastTouchRef = useRef({ x: 0, y: 0 });

    const roomDimensions = {
        width: 10,
        height: 8,
        depth: 10,
    };

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        console.log('isTouchDevice', isTouchDevice);

        const scene = sceneRef.current;
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, groundHeight, roomDimensions.width / 2 - 1);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current = renderer;
        mountRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [isTouchDevice]); // Include isTouchDevice in the dependency array

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const textureLoader = new THREE.TextureLoader();
                const loadedTexture = textureLoader.load(e.target.result);
                setTexture(loadedTexture);
            };
            reader.readAsDataURL(file);
        }
    };

    const checkCollision = (newPosition) => {
        const halfWidth = roomDimensions.width / 2;
        const halfDepth = roomDimensions.depth / 2;

        return (
            newPosition.x < -halfWidth + 0.1 ||
            newPosition.x > halfWidth - 0.1 ||
            newPosition.z < -halfDepth + 0.1 ||
            newPosition.z > halfDepth - 0.1
        );
    };

    const handleKeyDown = (event) => {
        const camera = cameraRef.current;
        const direction = new THREE.Vector3();
        const right = new THREE.Vector3();
        const newPosition = camera.position.clone();

        switch (event.key) {
            case 'z':
                camera.getWorldDirection(direction);
                direction.y = 0;
                direction.normalize();
                camera.position.addScaledVector(direction, moveSpeed);
                break;
            case 's':
                camera.getWorldDirection(direction);
                direction.y = 0;
                direction.normalize();
                camera.position.addScaledVector(direction, -moveSpeed);
                break;
            case 'q':
                camera.getWorldDirection(direction);
                direction.y = 0;
                direction.normalize();
                right.crossVectors(camera.up, direction).normalize();
                camera.position.addScaledVector(right, moveSpeed);
                break;
            case 'd':
                camera.getWorldDirection(direction);
                direction.y = 0;
                direction.normalize();
                right.crossVectors(camera.up, direction).normalize();
                camera.position.addScaledVector(right, -moveSpeed);
                break;
            default:
                break;
        }

        camera.position.y = groundHeight;

        if (checkCollision(camera.position)) {
            camera.position.copy(newPosition);
        }
    };

    const handleMouseMove = (event) => {
        if (isMouseDown || isTouchDevice) {
            console.log('Mouse Movement Detected:', event.movementX);
            const camera = cameraRef.current;
            camera.rotation.y -= event.movementX * rotationSpeed;
        }
    };

    const handleTouchMove = (event) => {
        if (isTouchDevice) {
            const camera = cameraRef.current;
            const touch = event.touches[0];
            const movementX = touch.clientX - lastTouchRef.current.x;
            lastTouchRef.current = { x: touch.clientX, y: touch.clientY };

            camera.rotation.y -= movementX * rotationSpeed;
        }
    };

    const handleMouseDown = (event) => {
        if (event.button === 0) {
            setIsMouseDown(true);
        }
    };

    const handleMouseUp = (event) => {
        if (event.button === 0) {
            setIsMouseDown(false);
        }
    };

    const handleTouchStart = (event) => {
        if (isTouchDevice) {
            const touch = event.touches[0];
            lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);

            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isMouseDown, isTouchDevice]); // Include isTouchDevice in the dependency array

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div ref={mountRef}>
                <Room scene={sceneRef.current} texture={texture} />
                <Sphere scene={sceneRef.current} />
            </div>
        </div>
    );
}

export default App;
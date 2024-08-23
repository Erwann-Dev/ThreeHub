import {useEffect, useRef, useState} from 'react'
import './App.css'
import * as THREE from "three";
import Room from "./Room.jsx";
import Sphere from "./Sphere.jsx";

function App() {
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef(null);
    const [texture, setTexture] = useState(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const rotationSpeed = 0.005; // Adjust this for faster/slower rotation
    const moveSpeed = 0.3; // Adjust this for faster/slower movement
    const groundHeight = 1; // The height of the camera from the ground

    const roomDimensions = {
        width: 10,
        height: 8,
        depth: 10
    };

    useEffect(() => {
        const scene = sceneRef.current;
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, groundHeight, roomDimensions.width / 2 - 1); // Set initial camera position
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    // Handle image file upload
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

    // Collision detection with room boundaries
    const checkCollision = (newPosition) => {
        const halfWidth = roomDimensions.width / 2;
        const halfDepth = roomDimensions.depth / 2;

        if (
            newPosition.x < -halfWidth + 0.1 || newPosition.x > halfWidth - 0.1 ||
            newPosition.z < -halfDepth + 0.1 || newPosition.z > halfDepth - 0.1
        ) {
            return true;
        }
        return false;
    };

    // Custom ZQSD movement logic with collision detection and ground restriction
    const handleKeyDown = (event) => {
        const camera = cameraRef.current;
        const direction = new THREE.Vector3();
        const right = new THREE.Vector3();
        const newPosition = camera.position.clone();

        switch (event.key) {
            case 'z': // Move forward
                camera.getWorldDirection(direction);
                direction.y = 0; // Prevent upward/downward movement
                direction.normalize();
                camera.position.addScaledVector(direction, moveSpeed);
                break;
            case 's': // Move backward
                camera.getWorldDirection(direction);
                direction.y = 0;
                direction.normalize();
                camera.position.addScaledVector(direction, -moveSpeed);
                break;
            case 'q': // Strafe left
                camera.getWorldDirection(direction);
                direction.y = 0;
                direction.normalize();
                right.crossVectors(camera.up, direction).normalize();
                camera.position.addScaledVector(right, moveSpeed);
                break;
            case 'd': // Strafe right
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

    // Handle mouse movement to rotate the camera (yaw only)
    const handleMouseMove = (event) => {
        if (isMouseDown) {
            const camera = cameraRef.current;
            camera.rotation.y -= event.movementX * rotationSpeed;
        }
    };

    // Handle mouse down event
    const handleMouseDown = (event) => {
        if (event.button === 0) { // Left mouse button
            setIsMouseDown(true);
        }
    };

    // Handle mouse up event
    const handleMouseUp = (event) => {
        if (event.button === 0) { // Left mouse button
            setIsMouseDown(false);
        }
    };

    // Adding event listeners inside useEffect with cleanup
    useEffect(() => {
        const handleMouseMoveWrapper = (event) => handleMouseMove(event);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousemove', handleMouseMoveWrapper);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousemove', handleMouseMoveWrapper);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isMouseDown]);

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

export default App

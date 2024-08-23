import { useEffect, useRef, useState } from 'react';
import './App.css';
import Room from './Components/Room.jsx';
import Sphere from './Components/Sphere.jsx';
import VirtualJoystick from './Components/VirtualJoystick.jsx';
import handleKeyDown from "./interaction/KeyboardEvent.jsx";
import { handleMouseMove, handleMouseDown, handleMouseUp } from "./interaction/MouseEvent.jsx";
import { handleTouchMove, handleTouchStart } from "./interaction/TouchEvent.jsx";
import { setupScene, setupCamera, setupRenderer } from './utils/SceneUtils.jsx';
import { addEventListeners, removeEventListeners } from './utils/EventListeners.jsx';
import * as THREE from 'three';

function App() {
    const mountRef = useRef(null);
    const sceneRef = useRef(setupScene());
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const rotationSpeed = 0.005;
    const moveSpeed = 0.3;
    const groundHeight = 0;
    const lastTouchRef = useRef({ x: 0, y: 0 });

    const roomDimensions = {
        width: 10,
        height: 8,
        depth: 10,
    };

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

        cameraRef.current = setupCamera(window.innerWidth, window.innerHeight, groundHeight, roomDimensions.width);
        rendererRef.current = setupRenderer(window.innerWidth, window.innerHeight, mountRef);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        sceneRef.current.add(ambientLight);

        const animate = () => {
            requestAnimationFrame(animate);
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };

        animate();

        const handleResize = () => {
            cameraRef.current.aspect = window.innerWidth / window.innerHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
            if (!isTouchDevice) {
                window.addEventListener('touchmove', handleTouchMove);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }
            rendererRef.current.dispose();
        };
    }, []);

    const keyDownHandler = (event) => handleKeyDown(event, cameraRef, moveSpeed, groundHeight, roomDimensions);
    const mouseMoveHandler = (event) => handleMouseMove(event, isMouseDown, isTouchDevice, cameraRef, rotationSpeed);
    const mouseDownHandler = (event) => handleMouseDown(event, setIsMouseDown);
    const mouseUpHandler = (event) => handleMouseUp(event, setIsMouseDown);
    const touchMoveHandler = (event) => handleTouchMove(event, isTouchDevice, cameraRef, lastTouchRef, rotationSpeed);
    const touchStartHandler = (event) => handleTouchStart(event, isTouchDevice, lastTouchRef);
    const joystickStartHandler = ()  => window.removeEventListener('touchmove', touchMoveHandler);
    const joystickEndHandler = () => window.addEventListener('touchmove', touchMoveHandler);

    useEffect(() => {
        addEventListeners(
            keyDownHandler,
            mouseMoveHandler,
            mouseDownHandler,
            mouseUpHandler,
            touchMoveHandler,
            touchStartHandler,
            joystickStartHandler,
            joystickEndHandler
        );

        return () => {
            removeEventListeners(
                keyDownHandler,
                mouseMoveHandler,
                mouseDownHandler,
                mouseUpHandler,
                touchMoveHandler,
                touchStartHandler,
                joystickStartHandler,
                joystickEndHandler
            );
        };
    }, [isMouseDown, isTouchDevice]);

    return (
        <div>
            <div ref={mountRef}>
                <Room scene={sceneRef.current} />
                <Sphere scene={sceneRef.current} />
                {isTouchDevice && (
                    <VirtualJoystick
                        cameraRef={cameraRef}
                        moveSpeed={moveSpeed}
                        roomDimensions={roomDimensions}
                        groundHeight={groundHeight}
                        rotationSpeed={rotationSpeed}
                        lastTouchRef={lastTouchRef}
                        isTouchDevice={isTouchDevice}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
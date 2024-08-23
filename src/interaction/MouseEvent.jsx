const handleMouseMove = (event, isMouseDown, isTouchDevice, cameraRef, rotationSpeed) => {
    if ((isMouseDown || isTouchDevice)) {  // Check if joystick is not in use
        const camera = cameraRef.current;
        camera.rotation.y -= event.movementX * rotationSpeed;
    }
};



const handleMouseDown = (event, setIsMouseDown) => {
    if (event.button === 0) {
        setIsMouseDown(true);
    }
};

const handleMouseUp = (event, setIsMouseDown) => {
    if (event.button === 0) {
        setIsMouseDown(false);
    }
};

export { handleMouseMove, handleMouseDown, handleMouseUp };
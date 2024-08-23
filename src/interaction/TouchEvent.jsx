
const handleTouchMove = (event, isTouchDevice, cameraRef, lastTouchRef, rotationSpeed) => {
    if (isTouchDevice) {
        const camera = cameraRef.current;
        const touch = event.touches[0];
        const movementX = touch.clientX - lastTouchRef.current.x;
        lastTouchRef.current = {x: touch.clientX, y: touch.clientY};

        camera.rotation.y -= movementX * rotationSpeed;
    }
};

const handleTouchStart = (event, isTouchDevice, lastTouchRef) => {
    if (isTouchDevice) {
        const touch = event.touches[0];
        lastTouchRef.current = {x: touch.clientX, y: touch.clientY};
    }
};

export { handleTouchMove, handleTouchStart };
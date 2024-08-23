export const addEventListeners = (
    keyDownHandler,
    mouseMoveHandler,
    mouseDownHandler,
    mouseUpHandler,
    touchMoveHandler,
    touchStartHandler,
    joystickStartHandler,
    joystickEndHandler
) => {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('touchstart', touchStartHandler);
    window.addEventListener('touchmove', touchMoveHandler);
    window.addEventListener('joystickstart', joystickStartHandler);
    window.addEventListener('joystickend', joystickEndHandler);
};

export const removeEventListeners = (
    keyDownHandler,
    mouseMoveHandler,
    mouseDownHandler,
    mouseUpHandler,
    touchMoveHandler,
    touchStartHandler,
    joystickStartHandler,
    joystickEndHandler
) => {
    window.removeEventListener('keydown', keyDownHandler);
    window.removeEventListener('mousemove', mouseMoveHandler);
    window.removeEventListener('mousedown', mouseDownHandler);
    window.removeEventListener('mouseup', mouseUpHandler);
    window.removeEventListener('touchstart', touchStartHandler);
    window.removeEventListener('touchmove', touchMoveHandler);
    window.removeEventListener('joystickstart', joystickStartHandler);
    window.removeEventListener('joystickend', joystickEndHandler);
};
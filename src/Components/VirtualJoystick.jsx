import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { handleJoystickMove } from '../interaction/JoystickEvent.jsx';
import {checkCollision} from "../utils/Collision.jsx";

const VirtualJoystick = ({ cameraRef, moveSpeed, roomDimensions, groundHeight}) => {

    useEffect(() => {
        const joystick = document.getElementById('joystick');
        let isDragging = false;
        let startX, startY;

        const onTouchStart = (event) => {
            dispatchEvent(new Event('joystickstart'));
            isDragging = true;
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        };

        const onTouchMove = (event) => {
            if (isDragging) {
                const deltaX = event.touches[0].clientX - startX;
                const deltaY = event.touches[0].clientY - startY;

                const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), 40);
                const angle = Math.atan2(deltaY, deltaX);

                const moveX = distance * Math.cos(angle);
                const moveY = distance * Math.sin(angle);

                joystick.style.transform = `translate(${moveX}px, ${moveY}px)`;

                handleJoystickMove(moveX, moveY, cameraRef, moveSpeed, roomDimensions, groundHeight );
            }
        };

        const onTouchEnd = () => {
            dispatchEvent(new Event('joystickend'));
            isDragging = false;
            joystick.style.transform = 'translate(0, 0)';
        };

        joystick.addEventListener('touchstart', onTouchStart);
        joystick.addEventListener('touchmove', onTouchMove);
        joystick.addEventListener('touchend', onTouchEnd);

        return () => {
            joystick.removeEventListener('touchstart', onTouchStart);
            joystick.removeEventListener('touchmove', onTouchMove);
            joystick.removeEventListener('touchend', onTouchEnd);
        };
    }, [cameraRef, moveSpeed, checkCollision, groundHeight]);

    return (
        <div id="joystickContainer">
            <div id="joystick"></div>
        </div>
    );
};

VirtualJoystick.propTypes = {
    cameraRef: PropTypes.object,
    moveSpeed: PropTypes.number,
    roomDimensions: PropTypes.object,
    groundHeight: PropTypes.number,
};

export default VirtualJoystick;
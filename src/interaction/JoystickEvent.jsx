import * as THREE from "three";
import {checkCollision} from "../utils/Collision.jsx";

const handleJoystickMove = (moveX, moveY, cameraRef, moveSpeed, roomDimensions, groundHeight) => {
    const camera = cameraRef.current;
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(direction);
    direction.y = 0; // Lock movement to the horizontal plane
    direction.normalize();

    right.crossVectors(camera.up, direction).normalize();

    const newPosition = camera.position.clone();

    newPosition.addScaledVector(direction, -moveY * moveSpeed * 0.01);
    newPosition.addScaledVector(right, -moveX * moveSpeed * 0.01);

    if (!checkCollision(newPosition, roomDimensions)) {
        camera.position.copy(newPosition);
    }

    camera.position.y = groundHeight;
};
export { handleJoystickMove };
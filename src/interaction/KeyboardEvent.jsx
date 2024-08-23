import * as THREE from "three";
import {checkCollision} from "../utils/Collision.jsx";

const handleKeyDown = (event, cameraRef, moveSpeed, groundHeight, roomDimensions) => {
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

    if (checkCollision(camera.position, roomDimensions)) {
        camera.position.copy(newPosition);
    }
};

export default handleKeyDown;
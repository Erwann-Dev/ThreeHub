import { useEffect } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';

function Board({ scene, texture }) {
    useEffect(() => {
        if (!texture) return;

        const boardWidth = 2;
        const boardHeight = 1.5;
        const boardGeometry = new THREE.PlaneGeometry(boardWidth, boardHeight);
        const boardMaterial = new THREE.MeshBasicMaterial({ map: texture });

        const board = new THREE.Mesh(boardGeometry, boardMaterial);

        board.position.set(0, 1.5, -4.9);
        scene.add(board);

        return () => {
            scene.remove(board);
            boardGeometry.dispose();
            boardMaterial.dispose();
        };
    }, [texture, scene]);

    return null;
}

Board.propTypes = {
    scene: PropTypes.object.isRequired,
    texture: PropTypes.object,
};

export default Board;
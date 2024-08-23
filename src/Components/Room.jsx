import { useEffect } from 'react';
import * as THREE from 'three';
import Board from './Board.jsx';
import WallBrick from "../assets/textures/06_brick_texture.jpeg";
import WoodFloor from "../assets/textures/07_woody_floor.jpeg";
import Ceiling from "../assets/textures/08_ceiling.jpeg";
import PropTypes from 'prop-types';

function Room({ scene }) {
    useEffect(() => {
        const loader = new THREE.TextureLoader();

        const brickTexture = loader.load(
            WallBrick,
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(5, 2.5);
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the texture.', error);
            }
        );

        const marbreTexture = loader.load(
            WoodFloor,
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(5, 2.5);
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the texture.', error);
            }
        );

        const ceilingTexture = loader.load(
            Ceiling,
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(5, 2.5);
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the texture.', error);
            }
        );

        // Create materials for the walls, floor, and ceiling
        const wallMaterial = new THREE.MeshStandardMaterial({
            map: brickTexture,
            side: THREE.DoubleSide,
        });

        const floorMaterial = new THREE.MeshStandardMaterial({
            map: marbreTexture,
            side: THREE.DoubleSide,
        });

        const ceilingMaterial = new THREE.MeshStandardMaterial({
            map: ceilingTexture,
            side: THREE.DoubleSide,
        });

        // Create walls
        const wallGeometry = new THREE.PlaneGeometry(10, 5);

        const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
        backWall.position.z = -5;

        const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
        frontWall.position.z = 5;
        frontWall.rotation.y = Math.PI;

        const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        leftWall.position.x = -5;
        leftWall.rotation.y = Math.PI / 2;

        const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
        rightWall.position.x = 5;
        rightWall.rotation.y = -Math.PI / 2;

        // Create floor
        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -2.5;

        // Create ceiling
        const ceiling = new THREE.Mesh(floorGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 2.5;

        // Add everything to the scene
        scene.add(backWall, frontWall, leftWall, rightWall, floor, ceiling);

        return () => {
            scene.remove(backWall, frontWall, leftWall, rightWall, floor, ceiling);
            wallGeometry.dispose();
            floorGeometry.dispose();
            wallMaterial.dispose();
            floorMaterial.dispose();
            ceilingMaterial.dispose();
        };
    }, [scene]);

    return (
        <>
            <Board scene={scene} />
        </>
    );
}

Room.propTypes = {
    scene: PropTypes.object,
};

export default Room;
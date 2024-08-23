export const checkCollision = (newPosition, roomDimensions) => {
    const halfWidth = roomDimensions.width / 2;
    const halfDepth = roomDimensions.depth / 2;
    return (
        newPosition.x < -halfWidth + 0.1 ||
        newPosition.x > halfWidth - 0.1 ||
        newPosition.z < -halfDepth + 0.1 ||
        newPosition.z > halfDepth - 0.1
    );
};
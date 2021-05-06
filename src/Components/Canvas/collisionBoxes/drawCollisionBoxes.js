export const drawCollisionBoxes = (c, map) => {
  const arrayOfVertices = Object.keys(map.graphObj);
  arrayOfVertices.forEach((vertexName) => {
    const vertex = map.graphObj[vertexName];
    if (vertex.occupied) {
      drawYellowCircle(c, vertex.x + 25, vertex.y + 25, 35);
    }
  });
};

const drawYellowCircle = (c, x, y, radius) => {
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI * 2, false);
  c.fillStyle = "rgba(191, 191, 63, 0.35)";
  c.strokeStyle = "red";
  c.stroke();
  c.fill();
};

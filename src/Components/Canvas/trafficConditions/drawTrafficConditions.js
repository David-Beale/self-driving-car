export const drawTrafficConditions = (c, map, showTraffic) => {
  const arrayOfVertices = Object.keys(map.graphObj);
  arrayOfVertices.forEach((vertexName) => {
    const vertex = map.graphObj[vertexName];
    vertex.occupiedCheck();
    if (showTraffic) drawTraffic(c, vertex.x, vertex.y, vertex.average);
  });
};

const getColor = (average) => {
  switch (true) {
    case average === 0:
      return "rgba(70, 240, 36, 0)";
    case average <= 15:
      return "rgba(70, 240, 36, 0.1)";
    case average <= 25:
      return "rgba(226, 240, 36, 0.3)";
    default:
      return "rgba(240, 36, 36, 0.3)";
  }
};

const drawTraffic = (c, x, y, average) => {
  const color = getColor(average);
  c.beginPath();
  c.fillStyle = color;
  c.fillRect(x, y, 50, 50);
};

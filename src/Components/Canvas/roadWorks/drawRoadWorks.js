import roadWorksImage from "../../../Assets/roadworks.jpg";
const roadWorks = new Image();
roadWorks.src = roadWorksImage;

export const drawRoadWorks = (c, map) => {
  const arrayOfVertices = Object.keys(map.graphObj);
  arrayOfVertices.forEach((vertexName) => {
    const vertex = map.graphObj[vertexName];
    if (vertex.roadWorks) {
      drawRoadWorksImage(c, vertex.x, vertex.y);
    }
  });
};

const drawRoadWorksImage = (c, x, y) => {
  c.drawImage(roadWorks, x, y, 50, 50);
};

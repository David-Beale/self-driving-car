import { useMemo } from "react";
import { formattedTiles } from "../data/formattedMapData";
import { startingRoadWorks } from "../roadWorks/startingRoadWorks";
import Graph from "./helpers/graph.js";
import Vertex from "./helpers/vertex.js";
const map = new Graph({ directed: true });

const setupVertices = (idCounter, x, y) => {
  let vertexA = new Vertex(idCounter + "A", x, y);
  let vertexB = new Vertex(idCounter + "B", x + 50, y);
  let vertexC = new Vertex(idCounter + "C", x, y + 50);
  let vertexD = new Vertex(idCounter + "D", x + 50, y + 50);
  return [vertexA, vertexB, vertexC, vertexD];
};

const setupEdges = (verticesMap, i, j) => {
  const [a, b, c, d] = verticesMap[i][j];
  const type = formattedTiles[i][j];
  const rightA = verticesMap[i][j + 1][0];
  const rightC = verticesMap[i][j + 1][2];
  const downA = verticesMap[i + 1][j][0];
  const downB = verticesMap[i + 1][j][1];

  switch (type) {
    case "HR":
      map.addEdge(a, b);
      map.addEdge(d, c);
      connectRightTile(b, rightA, rightC, d);
      break;
    case "VR":
      map.addEdge(b, d);
      map.addEdge(c, a);
      connectDownTile(d, downB, downA, c);
      break;
    case "TLC":
      a.corner = "TLCOuter";
      d.corner = "TLCInner";
      map.addEdge(a, b);
      map.addEdge(c, a);
      connectDownTile(d, downB, downA, c);
      connectRightTile(b, rightA, rightC, d);
      break;
    case "TRC":
      b.corner = "TRCOuter";
      c.corner = "TRCInner";
      map.addEdge(a, b);
      map.addEdge(b, d);
      connectDownTile(d, downB, downA, c);
      break;
    case "BLC":
      c.corner = "BLCOuter";
      b.corner = "BLCInner";
      map.addEdge(c, a);
      map.addEdge(d, c);
      connectRightTile(b, rightA, rightC, d);
      break;
    case "BRC":
      d.corner = "BRCOuter";
      a.corner = "BRCInner";
      map.addEdge(b, d);
      map.addEdge(d, c);
      break;
    case "TT":
      junction(a, b, c, d);
      connectRightTile(b, rightA, rightC, d);
      break;
    case "TB":
      junction(a, b, c, d);
      connectDownTile(d, downB, downA, c);
      connectRightTile(b, rightA, rightC, d);
      break;
    case "TL":
      junction(a, b, c, d);
      connectDownTile(d, downB, downA, c);
      break;
    case "TR":
      junction(a, b, c, d);
      connectDownTile(d, downB, downA, c);
      connectRightTile(b, rightA, rightC, d);
      break;
    case "XR":
      junction(a, b, c, d);
      connectDownTile(d, downB, downA, c);
      connectRightTile(b, rightA, rightC, d);
      break;
    default:
      break;
  }
};
const junction = (a, b, c, d) => {
  map.addEdge(a, b);
  map.addEdge(b, d);
  map.addEdge(c, a);
  map.addEdge(d, c);
};
const connectRightTile = (b, rightA, rightC, d) => {
  map.addEdge(b, rightA);
  map.addEdge(rightC, d);
};
const connectDownTile = (d, downB, downA, c) => {
  map.addEdge(d, downB);
  map.addEdge(downA, c);
};

export const useGraph = () => {
  return useMemo(() => {
    const verticesMap = [];
    let idCounter = 1;
    //setup vertices. We will split each tile into 4 vertices.
    //This allows us to have two lanes of traffic and crossroads etc.
    for (let i = 0; i < formattedTiles.length; i++) {
      verticesMap.push([]);
      for (let j = 0; j < formattedTiles[0].length; j++) {
        let type = formattedTiles[i][j];
        if (!type) {
          verticesMap[i].push(0);
          continue;
        }
        const newVertices = setupVertices(idCounter, j * 100, i * 100);
        newVertices.forEach((vertex) => map.addVertex(vertex));
        verticesMap[i].push(newVertices);
        idCounter++;
      }
    }
    //setup edges
    for (let i = 0; i < formattedTiles.length; i++) {
      for (let j = 0; j < formattedTiles[0].length; j++) {
        if (verticesMap[i][j]) {
          setupEdges(verticesMap, i, j);
        }
      }
    }
    startingRoadWorks(map);
    return [map, verticesMap];
  }, []);
};

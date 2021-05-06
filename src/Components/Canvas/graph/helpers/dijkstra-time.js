import MinHeap from "./Heap";

const dijkstra = (graph, startVertex, endVertex) => {
  const distances = {};
  for (let vertex in graph) {
    distances[vertex] = { totalDistance: Infinity, path: [startVertex] };
  }
  distances[startVertex] = { totalDistance: 0, path: [startVertex] };
  const toExplore = new MinHeap();

  toExplore.add({ distance: 0, vertex: startVertex, path: [startVertex] });
  let minDist = Infinity;
  while (toExplore.count) {
    const { distance, vertex, path } = toExplore.retrieveMin();

    for (let edge of graph[vertex].edges) {
      const edgeDist = graph[vertex].average;
      const neighbour = edge[0];

      const newDistance = distance + edgeDist;
      const newPath = [...path, neighbour];

      if (
        newDistance >= distances[neighbour].totalDistance ||
        newDistance > minDist
      ) {
        continue;
      }

      distances[neighbour].totalDistance = newDistance;
      distances[neighbour].path = newPath;

      if (neighbour === endVertex && newDistance < minDist) {
        minDist = newDistance;
        continue;
      }
      toExplore.add({
        distance: newDistance,
        vertex: neighbour,
        path: newPath,
      });
    }
  }
  return distances[endVertex];
};
export default dijkstra;

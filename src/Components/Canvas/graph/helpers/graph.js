class Graph {
  constructor({ directed = false }) {
    this.directed = directed;
    this.graphObj = {};
  }
  addVertex(vertex) {
    this.graphObj[vertex.value] = vertex;
  }
  addEdge(fromVertex, toVertex, weight = 1) {
    this.graphObj[fromVertex.value].addEdge(toVertex.value, weight);
    if (this.directed === false) {
      this.graphObj[toVertex.value].addEdge(fromVertex.value, weight);
    }
  }
}

export default Graph;

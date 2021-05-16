class Vertex {
  constructor(value, x, z) {
    this.value = value;
    this.x = x;
    this.z = z;
    this.edges = [];
    this.occupied = false;
    this.light = "green";
    this.internalCounter = 0;
    this.averageArray = [];
    this.average = 10;
  }
  getEdges() {
    let newArr = [];
    for (let i = 0; i < this.edges.length; i++) {
      newArr.push(this.edges[i][0]);
    }
    return newArr;
  }
  addEdge(vertex, weight = 1) {
    this.edges.push([vertex, weight]);
  }
  occupiedCheck() {
    if (this.occupied === true) this.internalCounter++;
  }
  occupiedFalse() {
    this.occupied = false;
    if (this.internalCounter > 0) {
      this.averageArray.push(this.internalCounter);
      this.internalCounter = 0;
      if (this.averageArray.length > 10) this.averageArray.shift();
      if (this.averageArray.length) {
        const sum = this.averageArray.reduce((a, b) => a + b, 0);
        this.average = sum / this.averageArray.length;
      }
    }
  }

  getAverageTime() {
    return this.average;
  }
}

export default Vertex;

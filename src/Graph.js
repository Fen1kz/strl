class Graph {
  constructor() {
    this.nodes = [];
    this.edges = [];
  }
  
  addNode(node) {
    this.nodes.push(node);
  }
  
  addEdge(node1, node2) {
    const edge = new Edge(node1, node2)
    node1.edges.push(edge)
    node2.edges.push(edge)
    this.edges.push(edge)
  }
}

class Node {
  constructor(value = '') {
    this.value = value;
    this.edges = [];
  }
  
  toString() {
    return `(${this.value})`
  }
}

class Edge {
  constructor(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
  }
  
  toString() {
    return `${this.node1} ${this.node2}`
  }
}

module.exports = {
  Graph
  , Node
  , Edge
}

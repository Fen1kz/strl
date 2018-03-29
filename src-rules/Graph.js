class Graph {
  constructor() {
    this.nodes = [];
    this.edges = [];
  }
  
  addNode(node) {
    this.nodes.push(node);
  }
  
  hasEdge(node1, node2) {
    return node1.edges.find(edge => edge.node1 === node2 || edge.node2 === node2)
  }
  
  addEdge(node1, node2) {
    if (!this.hasEdge(node1, node2)) {
      const edge = new Edge(node1, node2)
      node1.edges.push(edge)
      node2.edges.push(edge)
      this.edges.push(edge)
    }
  }
  
  removeEdge(node1, node2) {
    const edge = this.hasEdge(node1, node2)
    if (edge) {
      node1.edges.splice(node1.edges.indexOf(edge), 1)
      node2.edges.splice(node2.edges.indexOf(edge), 1)
      this.edges.splice(this.edges.indexOf(edge), 1)
    }
  }
}

class Node {
  constructor(value = '') {
    this.value = value;
    this.edges = [];
  }
  
  toString() {
    return `${this.value}`
  }
}

class Edge {
  constructor(node1, node2, direction = 3) {
    this.node1 = node1;
    this.node2 = node2;
    this.direction = direction
  }
  
  toString() {
    return `${this.node1}${
(this.direction & 1) ? '<' : ''
}${'-'}${
(this.direction & 2) ? '>' : ''
}${this.node2}`
  }
}

module.exports = {
  Graph
  , Node
  , Edge
}

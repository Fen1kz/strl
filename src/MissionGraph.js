const LinkType = (() => {
  let i = 0;
  return {
      NO_LINK: i++
    , PATH: i++
    , START: i++
    , END: i++
    , MIDDLE: i++
    , LOGIC: i++
  }
})();

class MissionGraph {
  constructor() {
    this.nodes = {};
    this.length = 0;
  }
  
  addNode(node) {
    this.nodes[node.id] = node;
    this.length++;
    return node;
  }
  
  addNodes(...nodes) {
    return nodes.map(value => this.addNode(new Node(value)));
  }
  
  addTriple (value) {
    const nodes = this.addNodes('(','|',')')
    this.addLink(nodes[1], nodes[0], LinkType.START, false)
    this.addLink(nodes[0], nodes[1], LinkType.MIDDLE, false)
    this.addLink(nodes[2], nodes[1], LinkType.MIDDLE, false)
    this.addLink(nodes[1], nodes[2], LinkType.END, false)
    return nodes;
  }
  
  delNode(node) {
    this.getLinksTo(node)
      .forEach(([nodeId, type]) => this.delLink(node, this.nodes[nodeId]));
    delete this.nodes[node.id];
  }
  
  addLink(node1, node2, type = LinkType.PATH, twoWay = true) {
    node1.nodes[node2.id] = type;
    if (twoWay) node2.nodes[node1.id] = type;
  }
  
  delLink(node1, node2) {
    console.log('node2', node2)
    if (this.hasLink(node1, node2)) delete node1[node2.id]
    if (this.hasLink(node2, node1)) delete node2[node1.id]
  }
  
  hasLink(node1, node2) {
    return !!node1.nodes[node2.id];
  }
  
  getLinksOf(node) {
    return Object.entries(node.nodes);
  }
  
  getLinksTo(targetNode) {
    let result = [];
    Object.values(this.nodes).map((node) => {
      result = result.concat(this.getLinksOf(node)
        .filter(([nodeId, type]) => +nodeId === targetNode.id)
        .map(([nodeId, type]) => [node.id, type])
      )
    })
    return result;
  }
  
  merge(graph2, inputs, outputs) {
    if (inputs.length !== graph2.input.length 
      || inputs.length !== graph2.input.length) throw new Error('merge error');
    graph2.nodes.forEach((node) => {
      this.addNode(node);
    });
    graph2.links.forEach((link, nodeId) => {
      this.links[nodeId] = link
    });
    inputs.forEach((input, idx) => {
      this.addLink(input, graph2.input[idx])
    })
    outputs.forEach((output, idx) => {
      this.addLink(graph2.output[idx], output)
    })
    return this;
  }
  
  findGraph(searchStr) {
    const searchArr = searchStr.split(' ').map(nodeType => {
      return Object.values(this.nodes).filter(node => node.value === nodeType);
    });
    searchArr.forEach((nv1, nvIdx1) => {
      nv1.forEach((node1) => {
        searchArr.forEach((nv2, nvIdx2) => {
          if (nvIdx1 === nvIdx2) return;
          nv2.forEach((node2) => {
            console.log(node1.value, node2.value)
          })
        })
      })
    })
    return searchArr;
  }
  
  static fromTable(table) {
    const graph = new MissionGraph();
    const lines = table
      .split('\n')
      .filter(line => !!line.trim())
    const header = lines.shift();
    const nodes = header.match(/\S+/g)
      .map((node) => graph.addNode(new Node(node)))
      
    lines.forEach((lineRaw, lineIdx) => {
      const line = lineRaw.match(/\S+/g);
      line.shift();
      line.forEach((value, valueIdx) => {
        if (value !== '0' && value !== '-') {
          graph.addLink(nodes[lineIdx], nodes[valueIdx])
        }
      })
    })
    
    return graph;
  }
  
  toTable() {
    const prefix = ' '.repeat(Object.values(this.nodes)
      .reduce((max, node) => node.value.length > max.value.length ? node : max)
      .value.length)
    return `${prefix} ${
      Object.values(this.nodes).join(' ')
    }\n${
      Object.values(this.nodes).map((node, index) => {
        return `${node}${' '.repeat(prefix.length - node.value.length)}${
          Object.values(this.nodes)
            .map(node2 => ' ' 
              + (node.nodes[node2.id] || '0')
              + ' '.repeat(node2.value.length - 1) )
        .join('')}`
    }).join('\n')}`
  }
  // 
  // toString() {
  //   return (this.nodes)
  // }
}

class Node {
  constructor(value) {
    this.id = Node.NODE_ID++;
    this.value = value;
    this.nodes = {};
  }
  
  toString() {
    return this.value;
  }
}
Node.NODE_ID = 0;

MissionGraph.Node = Node;

module.exports = {MissionGraph, LinkType}

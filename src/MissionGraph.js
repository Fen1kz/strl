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
  
  delNode(nodeId) {
    this.getLinksTo(nodeId).forEach(node2 => delete this.links[node2.id][nodeId])
    delete this.nodes[nodeId];
    delete this.links[nodeId];
    this.length--;
  }
  
  addLink(node1, node2, type = LinkType.NORMAL, twoWay = true) {
    node1.nodes[node2.id] = type;
    if (twoWay) node2.nodes[node1.id] = type;
  }
  
  delLink(id1, id2) {
    if (this.links[id1]) this.links[id1][id2] = 0;
    // if (this.links[id2]) this.links[id2][id1] = 0
  }
  
  hasLink(id1, id2) {
    return this.links[id1] && this.links[id1][id2];
  }
  
  getLinksFrom(id1) {
    if (!this.links[id1]) return [];
    return this.links[id1].map((v, k) => !!v && this.nodes[k]).filter(n => !!n);
  }
  
  getLinksTo(id1) {
    const result = [];
    this.links.map((linksOf, node2id) => {
      return linksOf.map((v, id) => {
        if (!!v && id == id1) {
          result.push(this.nodes[node2id]);
        }
      }).filter(n => !!n)
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
            .map(node2 => 
              ' '.repeat(node2.value.length) 
              + (node.nodes[node2.id]
                ? node.nodes[node2.id]
                : '0'))
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

const LinkType = (() => {
  let i = 0;
  return {
      NO_LINK: i++
    , NORMAL: i++
    , ONE_WAY: i++
    , TO_START: i++
    , TO_EXIT: i++
    , TO_RANDOM: i++
  }
})();

module.exports = {MissionGraph, LinkType}

const mimickArray = (prop) => ({
  value (callback) {
    return Object.keys(this)[prop]((key, idx) => callback(this[key], key, idx))
  }
});

const getMap = () => {
  const map = {};
  Object.defineProperties(map, {
    map: mimickArray('map')
    , some: mimickArray('some')
    , forEach: mimickArray('forEach')
  });
  return map;
} 


class MissionGraph {
  constructor() {
    this.nodes = getMap();
    this.links = getMap();
    this.length = 0;
  }
  
  static fromPack(pack) {
    const graph = new MissionGraph();
    const nodes = pack.nodes.split(' ').map(n => graph.addNode(new Node(n)).id)
    pack.links
      .split('\n')
      .filter(line => line.trim())
      .forEach((line, lineIdx) => {
        graph.links[nodes[lineIdx]] = getMap()
        line.split(' ').forEach((link, linkIdx) => {
          if (link) {
            graph.links[nodes[lineIdx]][nodes[linkIdx]] = +link;
          }
        })
      })
    return graph;
  }
  
  addNode(node) {
    this.nodes[node.id] = node;
    this.length++;
    return node;
  }
  
  delNode(nodeId) {
    this.getLinksTo(nodeId).forEach(node2 => delete this.links[node2.id][nodeId])
    delete this.nodes[nodeId];
    delete this.links[nodeId];
    this.length--;
  }
  
  addLink(id1, id2) {
    if (!this.links[id1]) this.links[id1] = getMap();
    this.links[id1][id2] = 1
    // if (!this.links[id2]) this.links[id2] = getMap();
    // this.links[id2][id1] = 1
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
  
  
  toTable() {
    return `   ${this.nodes.map(n => n.value.length === 2 ? n.value : n.value + ' ')
      .join(' ')}\n${
    this.nodes.map((node, index) => {
      return `${node.value}  ${this.nodes.map(node2 => {
        return this.links[node.id] && this.links[node.id][node2.id] 
          ? this.links[node.id][node2.id] 
          : '0'
      }).join('  ')}`
    }).join('\n')}`
  }
}

class Node {
  constructor(value) {
    this.id = Node.NODE_ID++;
    this.value = value;
  }
}
Node.NODE_ID = 0;

MissionGraph.Node = Node;

module.exports = {MissionGraph}

const _ = require('lodash');
const {randomArray} = require('../Random');

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
    return nodes.map(name => this.addNode(new Node(name)));
  }
  
  addTriple (value) {
    const nodes = this.addNodes('(', '|' ,')')
    this.addLink(nodes[1].id, nodes[0].id, LinkType.START, false)
    this.addLink(nodes[0].id, nodes[1].id, LinkType.MIDDLE, false)
    this.addLink(nodes[2].id, nodes[1].id, LinkType.MIDDLE, false)
    this.addLink(nodes[1].id, nodes[2].id, LinkType.END, false)
    return nodes;
  }
  
  delNodes(...nodeIds) {
    nodeIds.forEach(nodeId => {
      this.linksTo(nodeId).forEach(({sourceId, targetId}) => {
        this.delLink(sourceId, targetId);
      });
      this.linksOf(nodeId).forEach(({sourceId, targetId}) => {
        this.delLink(sourceId, targetId);
      });
    });
    nodeIds.forEach(nodeId => {
      delete this.nodes[nodeId];
      this.length--;
    })
  }
  
  addLink(node1id, node2id, type = LinkType.PATH, twoWay = true) {
    const link12 = new Link(node1id, node2id, type)
    this.nodes[node1id].linksOf.push(link12)
    this.nodes[node2id].linksTo.push(link12)
    if (twoWay) {
      const link21 = new Link(node2id, node1id, type, link12);
      link12.sibling = link21;
      this.nodes[node2id].linksOf.push(link21);
      this.nodes[node1id].linksTo.push(link21);
    }
  }
  
  delLink(node1id, node2id) {
    _.remove(this.nodes[node1id].linksOf, {targetId: node2id});
    _.remove(this.nodes[node2id].linksTo, {sourceId: node1id});
    
    _.remove(this.nodes[node2id].linksOf, {targetId: node1id});
    _.remove(this.nodes[node1id].linksTo, {sourceId: node2id});
  }
  
  getLink(node1id, node2id) {
    return _.find(this.nodes[node1id].linksOf, {targetId: node2id});
  }
  
  linksOf(nodeId) {
    return this.nodes[nodeId].linksOf;
  }
  
  linksTo(nodeId) {
    return this.nodes[nodeId].linksTo;
  }
  
  merge(mergeGraph) {
    const midNode = randomArray(_.filter(this.nodes, {name: '|'}));
    if (!midNode) return false;
    const mId = midNode.id;
    const sId = _.find(this.linksOf(mId), {type: LinkType.START}).targetId;
    const eId = _.find(this.linksOf(mId), {type: LinkType.END}).targetId
        
    const filterTypes = ({type}) => 
      type !== LinkType.START 
      && type !== LinkType.MIDDLE 
      && type !== LinkType.END;
    
    const sOut = _.filter(this.linksOf(sId), filterTypes);
    const sIn = _.filter(this.linksTo(sId), filterTypes);
    
    const eOut = _.filter(this.linksOf(eId), filterTypes);
    const eIn = _.filter(this.linksTo(eId), filterTypes);
    
    const mOut = _.filter(this.linksOf(mId), filterTypes);
    const mIn = _.filter(this.linksTo(mId), filterTypes);
    
    while (mOut.length > 0) randomArray([sOut, eOut]).push(mOut.shift())
    while (mIn.length > 0) randomArray([sIn, eIn]).push(mIn.shift())
    
    const replaceStart = _.find(mergeGraph.nodes, {name: '<'})
          replaceStart.name = 's';
    const replaceExit = _.find(mergeGraph.nodes, {name: '>'})
          replaceExit.name = 's';
    
    _.forEach(mergeGraph.nodes, node => this.addNode(node))
    
    sOut.map(({sourceId, targetId, type}) => 
      this.addLink(replaceStart.id, targetId, type, false)
    );
    eOut.map(({sourceId, targetId, type}) => 
      this.addLink(replaceExit.id, targetId, type, false)
    );      
    sIn.map(({sourceId, targetId, type}) => 
      this.addLink(sourceId, replaceStart.id, type, false)
    );
    eIn.map(({sourceId, targetId, type}) => 
      this.addLink(sourceId, replaceExit.id, type, false)
    );
      
    this.delNodes(sId, mId, eId);
      
    return true;
  }
  
  static fromTable(table) {
    const graph = new MissionGraph();
    const lines = table
      .split('\n')
      .filter(line => !!line.trim())
    const header = lines.shift();
    const nodes = header.match(/\S+/g)
      .map((name) => graph.addNode(new Node(name)).id)
    
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
    const prefix = ' '.repeat(_.reduce(this.nodes, (max, node) => 
      node.name.length > max.name.length ? node : max)
      .name.length)
    return `${prefix} ${
      _.map(this.nodes, node => node.name).join(' ')
    }\n${
      _.map(this.nodes, node => {
        return `${node}${' '.repeat(prefix.length - node.name.length)}${
          _.map(this.nodes, node2 => {
            const link = _.find(node.linksOf, {targetId: node2.id})
            return ' ' 
              + (node.id == node2.id ? '-' 
                : link ? link.type 
                : '0')
              + ' '.repeat(node2.name.length - 1);
            })
          .join('')}`
      }).join('\n')}`
  }
  // 
  // toString() {
  //   return (this.nodes)
  // }
}

class Link {
  constructor(sourceId, targetId, type, sibling) {
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.type = type;
    this.sibling = sibling;
  }
  
  toString() {
    return `${this.sourceId} ${this.type}> ${this.targetId}`;
  }
}

class Node {
  constructor(name, data) {
    this.id = Node.NODE_ID++;
    this.name = name;
    this.data = {};
    this.linksOf = [];
    this.linksTo = [];
  }
  
  toString() {
    return this.name;
  }
}
Node.NODE_ID = 0;

MissionGraph.Node = Node;

module.exports = {MissionGraph, LinkType}

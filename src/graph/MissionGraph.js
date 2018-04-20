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
      _.clone(this.links(nodeId)).forEach(({sourceId, targetId}) => {
        this.delLink(sourceId, targetId);
      });
    });
    nodeIds.forEach(nodeId => {
      delete this.nodes[nodeId];
      this.length--;
    })
  }
  
  addLink(node1id, node2id, type = LinkType.PATH, twoWay = true) {
    const link = new Link(node1id, node2id, type, twoWay)
    this.nodes[node1id].links.push(link);
    this.nodes[node2id].links.push(link);
  }
  
  delLink(node1id, node2id) {
    _.remove(this.nodes[node1id].links, ({sourceId: sid, targetId: tid}) => 
      (sid === node1id && tid === node2id) || (sid === node2id && tid === node1id));
    _.remove(this.nodes[node2id].links, ({sourceId: sid, targetId: tid}) => 
      (sid === node1id && tid === node2id) || (sid === node2id && tid === node1id));
  }
  
  getLink(node1id, node2id) {
    return _.find(this.nodes[node1id].links, ({sourceId, targetId, twoWay}) =>
      (sourceId === node1id && targetId === node2id) 
      || (sourceId === node2id && targetId === node1id)
    );
  }
  
  links(nodeId) {
    return this.nodes[nodeId].links;
  }
  
  linksOf(nodeId) {
    return this.links(nodeId).filter(({sourceId, targetId, twoWay}) =>
      (sourceId === nodeId) || (targetId === nodeId && twoWay)
    );
  }
  
  linksTo(nodeId) {
    return this.links(nodeId).filter(({sourceId, targetId, twoWay}) =>
      (sourceId === nodeId && twoWay) || (targetId === nodeId)
    );
  }
  
  merge(mergeGraph) {
    const midNode = randomArray(_.filter(this.nodes, {name: '|'}));
    if (!midNode) return false;
    const mId = midNode.id;
    const sId = _.find(this.links(mId), {type: LinkType.START}).targetId;
    const eId = _.find(this.links(mId), {type: LinkType.END}).targetId
        
    const filterTypes = ({type}) => 
      type !== LinkType.START 
      && type !== LinkType.MIDDLE 
      && type !== LinkType.END;
    
    const startLinks = _.filter(this.links(sId), filterTypes);
    const endLinks = _.filter(this.links(eId), filterTypes);
    const midLinks = _.filter(this.links(mId), filterTypes);
    
    while (midLinks.length > 0) 
      randomArray([startLinks, endLinks]).push(midLinks.shift())
    
    const replaceStart = _.find(mergeGraph.nodes, {name: '<'})
          replaceStart.name = 's';
    const replaceEnd = _.find(mergeGraph.nodes, {name: '>'})
          replaceEnd.name = 's';
    
    _.forEach(mergeGraph.nodes, node => this.addNode(node))
    
    startLinks.map(({sourceId, targetId, type, direction}) => 
      sourceId === sId ? this.addLink(replaceStart.id, targetId, type, direction)
      : targetId === sId ? this.addLink(sourceId, replaceStart.id, type, direction)
      : null
    );
    endLinks.map(({sourceId, targetId, type, direction}) => 
      sourceId === sId ? this.addLink(replaceStart.id, targetId, type, direction)
      : targetId === sId ? this.addLink(sourceId, replaceStart.id, type, direction)
      : null
    );
    if (startLinks.some(l => l === null)) throw new Error(null)
    if (endLinks.some(l => l === null)) throw new Error(null)
      
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
            const link = this.getLink(node.id, node2.id);
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
  constructor(sourceId, targetId, type, twoWay) {
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.type = type;
    this.both = twoWay;
  }
  
  toString() {
    return `${this.sourceId} ${
      this.twoWay ? '<' : ''
    }${this.type}> ${this.targetId}`;
  }
}

class Node {
  constructor(name, data) {
    this.id = Node.NODE_ID++;
    this.name = name;
    this.data = {};
    this.links = [];
  }
  
  toString() {
    return this.name;
  }
}
Node.NODE_ID = 0;

MissionGraph.Node = Node;

module.exports = {MissionGraph, LinkType}

const {LinkType} = require('./MissionGraph');
const {randomArray} = require('../Random');
const _ = require('lodash');

const LevelLink = {
  N: 1
  , E: 2
  , S: 3
  , W: 4
}
const LevelLinkArray = [1,2,3,4]
const makeLevelLinkCounter = () => {
  let i = 0;
  return () => {
    return LevelLinkArray[i++ % LevelLinkArray.length];
  }
}

class LevelGraph {
  constructor(graph) {
    this.nodes = {};
    this.length = 0;
    
    const start = Object.values(graph.nodes).find(node => node.name === '<')
    
    const a = start.linksOf
    const b = _.filter(start.linksTo, link2 =>
      _.some(start.linksOf, link1 => 
        link1.sourceId === link2.sourceId && link2.sourceId === link1.sourceId
      ));
      
    const links = _().concat(a, b).filter({type: LinkType.PATH}).value();
    
    if (links.length > 4) console.warn('links more than 4');
    
    console.log(start.id, links.map(_.toString))
    
    start.data.x = 0;
    start.data.y = 0;
        
    let linkCounter = makeLevelLinkCounter();
    links.forEach(link => {
      
    })
    
    // graph.linksOf(start)
  }
  // 
  // addNode(node) {
  //   this.nodes[node.id] = node;
  //   this.length++;
  //   return node;
  // }
  // 
  // addNodes(...nodes) {
  //   return nodes.map(name => this.addNode(new Node(name)));
  // }
  // 
  // addTriple (value) {
  //   const nodes = this.addNodes('(','|',')')
  //   this.addLink(nodes[1].id, nodes[0].id, LinkType.START, false)
  //   this.addLink(nodes[0].id, nodes[1].id, LinkType.MIDDLE, false)
  //   this.addLink(nodes[2].id, nodes[1].id, LinkType.MIDDLE, false)
  //   this.addLink(nodes[1].id, nodes[2].id, LinkType.END, false)
  //   return nodes;
  // }
  // 
  // delNode(nodeId) {
  //   this.linksTo(nodeId)
  //     .forEach(([tNodeId, type]) => this.delLink(nodeId, tNodeId));
  //   delete this.nodes[nodeId];
  //   this.length--;
  // }
  // 
  // addLink(node1id, node2id, type = LinkType.PATH, twoWay = true) {
  //   this.nodes[node1id].linksOf[node2id] = type;
  //   this.nodes[node2id].linksTo[node1id] = type;
  //   if (twoWay) {
  //     this.nodes[node2id].linksOf[node1id] = type;
  //     this.nodes[node1id].linksTo[node1id] = type;
  //   }
  // }
  // 
  // delLink(node1id, node2id) {
  //   delete this.nodes[node1id].linksOf[node2id]
  //   delete this.nodes[node2id].linksTo[node1id]
  //   delete this.nodes[node2id].linksOf[node1id]
  //   delete this.nodes[node1id].linksTo[node2id]
  // }
  // 
  // hasLink(node1id, node2id) {
  //   return !!this.nodes[node1id].linksOf[node2id];
  // }
  // 
  // linksOf(nodeId) {
  //   return Object.entries(this.nodes[nodeId].linksOf);
  // }
  // 
  // linksTo(nodeId) {
  //   return Object.entries(this.nodes[nodeId].linksTo);
  // }
  // 
  // merge(mergeGraph) {    
  //   const midNode = randomArray(Object.values(this.nodes).filter(node => node.name === '|'));
  //   if (!midNode) return false;
  //   const mId = midNode.id;
  //   const sId = this.linksOf(mId).find(([nodeId, type]) => type === LinkType.START)[0]
  //   const eId = this.linksOf(mId).find(([nodeId, type]) => type === LinkType.END)[0]
  // 
  //   const filterTypes = ([nodeId, type]) => type !== LinkType.START && type !== LinkType.MIDDLE && type !== LinkType.END;
  // 
  //   const sOut = this.linksOf(sId).filter(filterTypes);
  //   const sIn = this.linksTo(sId).filter(filterTypes);
  // 
  //   const eOut = this.linksOf(eId).filter(filterTypes);
  //   const eIn = this.linksTo(eId).filter(filterTypes);
  // 
  //   const mOut = this.linksOf(mId).filter(filterTypes);
  //   const mIn = this.linksTo(mId).filter(filterTypes);
  // 
  //   while (mOut.length > 0) randomArray([sOut, eOut]).push(mOut.shift())
  //   while (mIn.length > 0) randomArray([sIn, eIn]).push(mIn.shift())
  // 
  //   const replaceStart = Object.values(mergeGraph.nodes)
  //     .find(node => node.name === '<')
  //   replaceStart.name = 's';
  //   const replaceExit = Object.values(mergeGraph.nodes)
  //     .find(node => node.name === '>')
  //   replaceExit.name = 's';
  // 
  //   Object.values(mergeGraph.nodes).forEach(node => this.addNode(node))
  // 
  //   sOut.map(([nodeId, type]) => this
  //     .addLink(replaceStart.id, nodeId, type, false))
  //   sIn.map(([nodeId, type]) => this
  //     .addLink(nodeId, replaceStart.id, type, false))
  //   eOut.map(([nodeId, type]) => this
  //     .addLink(replaceExit.id, nodeId, type, false))
  //   eIn.map(([nodeId, type]) => this
  //     .addLink(nodeId, replaceExit.id, type, false))
  // 
  //   this.delNode(sId);
  //   this.delNode(eId);
  //   this.delNode(mId);
  // 
  //   return true;
  // }
  // 
  // static fromTable(table) {
  //   const graph = new MissionGraph();
  //   const lines = table
  //     .split('\n')
  //     .filter(line => !!line.trim())
  //   const header = lines.shift();
  //   const nodes = header.match(/\S+/g)
  //     .map((name) => graph.addNode(new Node(name)).id)
  // 
  //   lines.forEach((lineRaw, lineIdx) => {
  //     const line = lineRaw.match(/\S+/g);
  //     line.shift();
  //     line.forEach((value, valueIdx) => {
  //       if (value !== '0' && value !== '-') {
  //         graph.addLink(nodes[lineIdx], nodes[valueIdx])
  //       }
  //     })
  //   })
  // 
  //   return graph;
  // }
  // 
  // toTable() {
  //   const prefix = ' '.repeat(Object.values(this.nodes)
  //     .reduce((max, node) => node.name.length > max.name.length ? node : max)
  //     .name.length)
  //   return `${prefix} ${
  //     Object.values(this.nodes).join(' ')
  //   }\n${
  //     Object.values(this.nodes).map((node, index) => {
  //       return `${node}${' '.repeat(prefix.length - node.name.length)}${
  //         Object.values(this.nodes)
  //           .map(node2 => ' ' 
  //             + (node.id === node2.id ? '-' : node.linksOf[node2.id] || '0')
  //             + ' '.repeat(node2.name.length - 1) )
  //       .join('')}`
  //   }).join('\n')}`
  // }
  // 
  // toString() {
  //   return (this.nodes)
  // }
}

class Node {
  constructor(name, data) {
    this.id = Node.NODE_ID++;
    this.name = name;
    this.data = data;
    this.linksOf = {};
    this.linksTo = {};
  }
  
  toString() {
    return this.name;
  }
}
Node.NODE_ID = 0;

LevelGraph.Node = Node;

module.exports = {LevelGraph}
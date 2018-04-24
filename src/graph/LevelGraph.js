const {LinkType} = require('./MissionGraph');
const {randomArray} = require('../Random');
const _ = require('lodash');

const {JSDOM} = require('jsdom');

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
    
    const queue = [start];
    for (let i = 0; i < queue.length; ++i) {
      const node = queue[i];
      _.forEach(node.links, (link) => {
        const node1 = graph.nodes[link.sourceId];
        if (!_.some(queue, {id: node1.id})) {
          queue.push(node1);
        }
        const node2 = graph.nodes[link.targetId];
        if (!_.some(queue, {id: node2.id})) {
          queue.push(node2);
        }
      })
    }
    
    const CENTER = 400;
    const LENGTH = 40;
    const RADIUS = LENGTH / 2;
    const GRID = LENGTH * 2;
    
    queue.forEach((node, i) => {
      const angle = (i * 2 * Math.PI / queue.length);
      node.data.x = 4 * LENGTH * Math.cos(angle);
      node.data.y = 4 * LENGTH * Math.sin(angle);
    })
    // queue.unshift()
    
    const adjust = () => {
      queue.forEach((node, i) => {
        const {x, y} = node.data;
        let forcex = 0;
        let forcey = 0;
        let forcec = 0;
        
        _.forEach(graph.linkedNodes(node.id), node => {
          const {x: nx, y: ny} = node.data;
          const dx = x - nx;
          const dy = y - ny;
          if ((dx*dx + dy*dy) > GRID * GRID) {
            forcex -= dx;
            forcey -= dy;
            forcec++;
          }
        });
        
        if (forcec > 0) {
          node.data.speedx = forcex / forcec / 5;
          node.data.speedy = forcey / forcec / 5;
        } else {
          node.data.speedx = 0;
          node.data.speedy = 0;
        }
        // console.log(node.data.speedx)
      });
      queue.forEach((node, i) => {
        const {x, y} = node.data;
        let forcex = 0;
        let forcey = 0;
        let forcec = 0;
        
        _.forEach(graph.nodes, (node) => {
          const {x: nx, y: ny} = node.data;
          const dx = x - nx;
          const dy = y - ny;
          if ((dx*dx + dy*dy) < GRID * GRID) {
            forcex += dx;
            forcey += dy;
            forcec++;
          }
        });
        if (forcec > 0) {
          node.data.speedNodex = -Math.sign(forcex) * (LENGTH - Math.abs(forcex));
          node.data.speedNodey = -Math.sign(forcey) * (LENGTH - Math.abs(forcey));
        } else {
          node.data.speedNodex = 0;
          node.data.speedNodey = 0;
        }
      });
      queue.forEach((node, i) => {
        const {x, y} = node.data;
        let tempx = x % GRID;
        if (Math.abs(tempx) > (GRID / 2)) {
          tempx = - Math.sign(tempx) * (GRID - Math.abs(tempx))
        }
        let tempy = y % GRID;
        if (Math.abs(tempy) > (GRID / 2)) {
          tempy = - Math.sign(tempy) * (GRID - Math.abs(tempy))
        }
        let forcex = -tempx;
        let forcey = -tempy;
        node.data.speedORTx = forcex
        node.data.speedORTy = forcey
        // console.log(x, x % LENGTH, forcex, node.data.speedORTx)
      });
      const speedl = (node, prop) => (
        node.data[prop + 'x'] * node.data[prop + 'x']
        + node.data[prop + 'y'] * node.data[prop + 'y']
      );
      let stable = true;
      queue.forEach((node, i) => {
        if (speedl(node, 'speed') > Math.pow(LENGTH / 2, 2)) {
          node.data.x += node.data.speedx
          node.data.y += node.data.speedy
          stable = false;
        }
      })
      queue.forEach((node, i) => {
        if (speedl(node, 'speedNode') > Math.pow(LENGTH / 2, 2)) {
          node.data.x += node.data.speedNodex
          node.data.y += node.data.speedNodey
          stable = false;
        }
      })
      console.log(stable);
      if (stable) {
        queue.forEach((node, i) => {
          node.data.x += node.data.speedORTx
          node.data.y += node.data.speedORTy
        })
      }
    }
    for (let i = 0; i < 440; ++i)
    adjust()
    // adjust()
    // adjust()
    // adjust()
    
    
    console.log(queue.map(n => `${n.id}${n.name}:[${n.links.join(';')}]`));
    
    const D3Node = require('d3-node');
    const d3n = new D3Node();
    const container = d3n.createSVG(CENTER*2,CENTER*2)
      .append('g')
    
    const nodeEnter = container.selectAll("g")
      .data(queue)
      .enter();
    
    const l2g = (xy) => CENTER + xy;
    const l2gX = (node) => l2g(node.data.x);
    const l2gY = (node) => l2g(node.data.y);
    
    const nodeGroup = nodeEnter
      .append('g')
    
    nodeGroup.append('circle')
        .attr('r', RADIUS)
        .attr('cx', l2gX)
        .attr('cy', l2gY)
        
    nodeGroup.append('line')
      .classed('speed', true)
      .attr('x1', l2gX)
      .attr('y1', l2gY)
      .attr('x2', node => l2gX(node) + node.data.speedx)
      .attr('y2', node => l2gY(node) + node.data.speedy)
      .style('stroke', 'green')
      .style('stroke-width', 2)
      
    nodeGroup.append('line')
      .classed('speedNode', true)
      .attr('x1', l2gX)
      .attr('y1', l2gY)
      .attr('x2', node => l2gX(node) + node.data.speedNodex)
      .attr('y2', node => l2gY(node) + node.data.speedNodey)
      .style('stroke', 'red')
      .style('stroke-width', 2)
      
    nodeGroup.append('line')
      .classed('length', true)
      .attr('x1', l2gX)
      .attr('y1', l2gY)
      .attr('x2', node => l2gX(node) + LENGTH * 2)
      .attr('y2', l2gY)
      .style('stroke', 'blue')
      .style('stroke-width', 2)
      
    nodeGroup.append('line')
      .classed('speedORT', true)
      .attr('x1', l2gX)
      .attr('y1', l2gY)
      .attr('x2', node => l2gX(node) + node.data.speedORTx)
      .attr('y2', node => l2gY(node) + node.data.speedORTy)
      .style('stroke', 'orange')
      .style('stroke-width', 2)
        
    nodeGroup.append('text')
      .text(node => node.id + node.name)
      .style('fill', 'red')
      .attr('x', l2gX)
      .attr('y', l2gY)
      
    const linkEnter = nodeEnter
      .selectAll('line.link')
      .data(node => node.links)
      .enter();
      
    linkEnter
        .append('line')
        .classed('link', true)
        .attr('x1', link => l2gX(graph.nodes[link.sourceId]))
        .attr('y1', link => l2gY(graph.nodes[link.sourceId]))
        .attr('x2', link => l2gX(graph.nodes[link.targetId]))
        .attr('y2', link => l2gY(graph.nodes[link.targetId]))
        .style('stroke', 'black')
        .style('stroke-width', 2)
    
    
    require('fs').writeFileSync('test.svg', d3n.svgString()) 
    // const window = new JSDOM('<div id="drawing"></div>');
    // const SVG = require('svg.js')(window);
    // 
    // SVG(window.document);
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

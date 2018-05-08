const _ = require('lodash');
const {randomInt, randomArray} = require('../Random');

const {LinkType} = require('./MissionGraph');
const {LevelRenderer} = require('./LevelRenderer');

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
    
    queue.forEach((node, i) => {
      // node.data.x = randomInt(-5, 5);
      // node.data.y = randomInt(-5, 5);
      node.data.x = randomInt(i, i);
      node.data.y = randomInt(i, i);
      console.log(node.data.x)
      console.log(node.data.y)
    });
    
    const renderer = (new LevelRenderer()).render(graph)
  }
}

module.exports = {LevelGraph}

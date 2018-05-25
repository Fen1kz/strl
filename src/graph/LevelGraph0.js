const _ = require('lodash');
const {randomInt, randomArray} = require('../Random');

const {LinkType} = require('./MissionGraph');
const {LevelRenderer} = require('./LevelRenderer');

class LevelGraph {
  constructor(graph) {
    this.nodes = {};
    this.length = 0;
    
    const pairs = _.uniq(_.flatMap(graph.nodes, node => node.links));
    
    const state = {
      nodes: {}
      , positions: [{x: 0, y: 0}]
    };
    
    const edgeChecks = [
      (n0, n1) => {
        // const dx = Math.abs(n0.x - n1.x)
        // const dy = Math.abs(n0.y - n1.y)
        // return (
        //   (dx + dy > 2)
        //   || (dx > 0 && dy !== 0) 
        //   || (dy > 0 && dx !== 0) 
        // );
        // if (n0.id ===32 && n1.id === 34) console.log(
        //   n0.x !== n1.x
        //   , n0.x !== n1.y
        //   , Math.sqrt((n0.x-n1.x)*(n0.x-n1.x)+(n0.y-n1.y)*(n0.y-n1.y))
        // )
        // return (n0.x !== n1.x && n0.y !== n1.y )
        //   && (n0.x-n1.x)*(n0.x-n1.x)+(n0.y-n1.y)*(n0.y-n1.y) > 2
      }
  ]
    
    const pairChecks = [(n00, n01, n10, n11) => {
      const isect =  n00.id !== n10.id && n00.id !== n11.id
        && n01.id !== n10.id && n01.id !== n11.id
        && this.checkIntersection(n00.x, n00.y, n01.x, n01.y
        , n10.x, n10.y, n11.x, n11.y)
        // if (isect) console.log(n00, n01, n10, n11)
        return isect;
    }]
    
    const constraints = [(state) => {
      return !pairs.some(pair0 => {
        const node00 = state.nodes[pair0.sourceId];
        const node01 = state.nodes[pair0.targetId];
        if (!node00 || !node01) return;
        return (_.some(edgeChecks, (check) => check(node00, node01))
          || pairs.some(pair1 => {
            if (pair0 === pair1) return;
            const node10 = state.nodes[pair1.sourceId];
            const node11 = state.nodes[pair1.targetId];
            if (!node10 || !node11) return;
            return _.some(pairChecks
              , (check) => check(node00, node01, node10, node11));
          })
        );
      });
    }];
    
    const placeNode = (state, nodeId, position) => {
      const {x: px, y: py} = position;
      const nextState = {};
      nextState.positions = _.filter(state.positions
        , ({x, y}) => x !== px && y !== py);
      nextState.nodes = _.assign({}
        , state.nodes
        , {[nodeId]: _.assign({}
          , position
          , {id: nodeId}
        )});
      [[1,0], [0,1], [-1,0], [0, -1]].forEach(([addx, addy]) => {
        if (!_.some(nextState.nodes, ({x, y}) => px + addx === x && py === y + addy)) 
          nextState.positions.push({x: px + addx, y: py + addy})
      })
      return nextState;      
    };
    
    const isValid = (state, constraints) => {
      return constraints.some(constraint => constraint(state))
    }
    
    const getActions = (state, constraints) => {
      const actions = [];
      _.forEach(graph.nodes, node => {
        if (!state.nodes[node.id]) {
          state.positions.forEach(position => {
            const nextState = placeNode(state, node.id, position);
            if (isValid(nextState, constraints)) {
              actions.push({id: node.id, position});
            }
          })
        }
      })
      // console.log(actions)
      return actions;
    }
    
    const stateStack = [state];
    
    let i = 0, exitState;
    console.time('loop')
    while (stateStack.length !== 0 && ++i < 100) {
      const state = stateStack.pop();
      if (isValid(state, constraints) && _.every(graph.nodes, node => state.nodes[node.id])) {
        exitState = state;
        break;
      }
      getActions(state, constraints).forEach((action) => {
        const nextState = placeNode(state, action.id, action.position)
        stateStack.push(nextState);
      })
      if (i % 10000 === 0) console.log(stateStack.length, i)
    }
    console.timeEnd('loop')
    console.log(i)
    if (!exitState) return;
    const renderer = (new LevelRenderer()).render(graph, exitState)
  }
  
  queue() {
    // const start = Object.values(graph.nodes).find(node => node.name === '<')
    
    // const queue = [start];
    // for (let i = 0; i < queue.length; ++i) {
    //   const node = queue[i];
    //   _.forEach(node.links, (link) => {
    //     const node1 = graph.nodes[link.sourceId];
    //     if (!_.some(queue, {id: node1.id})) {
    //       queue.push(node1);
    //     }
    //     const node2 = graph.nodes[link.targetId];
    //     if (!_.some(queue, {id: node2.id})) {
    //       queue.push(node2);
    //     }
    //   })
    // }
    
    // queue.forEach((node, i) => {
    //   node.data.x = randomInt(-5, 5);
    //   node.data.y = randomInt(-5, 5);
    //   // node.data.x = i;
    //   // node.data.y = i;
    // });
  }
  
  checkIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denominator=(y4-y3)*(x1-x2)-(x4-x3)*(y1-y2);
    if (denominator == 0) {
      return ( 
      (x1*y2-x2*y1)*(x4-x3) - (x3*y4-x4*y3)*(x2-x1) == 0
      && (x1*y2-x2*y1)*(y4-y3) - (x3*y4-x4*y3)*(y2-y1) == 0
      )
    } else {
      const numerator_a=(x4-x2)*(y4-y3)-(x4-x3)*(y4-y2);
      const numerator_b=(x1-x2)*(y4-y2)-(x4-x2)*(y1-y2);
      const Ua=numerator_a/denominator;
      const Ub=numerator_b/denominator;
      return (Ua >= 0 && Ua <= 1 && Ub >= 0 && Ub <= 1)
    }
  }
}

module.exports = {LevelGraph}

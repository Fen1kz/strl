const _ = require('lodash');
const {randomInt, randomArray} = require('../Random');

const {LinkType} = require('./MissionGraph');
const {LevelRenderer} = require('./LevelRenderer');

class LevelGraph {
  constructor(graph) {
    this.nodes = {};
    this.length = 0;
    
    const pairs = _.uniq(_.flatMap(graph.nodes, node => node.links)).filter(link => link.type !== LinkType.LOGIC);
    // console.log(pairs);
    
    const state = {
      nodes: {}
      , positions: []
    };
    
    const edgeChecks = [
      (n0, n1) => {
        const dx = Math.abs(n0.x - n1.x)
        const dy = Math.abs(n0.y - n1.y)
        return (
          !(dx === 1 && dy === 1)
          && (dx > 0 && dy > 0) 
        );
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
      for (let p0 = 0; p0 < pairs.length; ++p0) {
        const pair0 = pairs[p0];
        const node00 = state.nodes[pair0.sourceId];
        const node01 = state.nodes[pair0.targetId];
        if (!node00 || !node01) continue;
        if (_.some(edgeChecks, (check) => check(node00, node01))) return false;
        for (let p1 = 0; p1 < pairs.length; ++p1) {
          const pair1 = pairs[p1];
          const node10 = state.nodes[pair1.sourceId];
          const node11 = state.nodes[pair1.targetId];
          if (!node10 || !node11) continue;
          if (_.some(pairChecks
            , (check) => check(node00, node01, node10, node11))) return false;
        }
      }
      return true;
    }];
    
    const addArray = [[1,0], [0,1], [-1,0], [0, -1]];
    const checkmap = (map, x, y) => map[x] && map[x][y]
    const addtomap = (map, x, y) => {
      if (!map[x]) map[x] = [];
      map[x][y] = true;
    }
    
    let z = 0;
    const makeKey = (x, y) => x + ':' + y;
    const globalmap = {};
    for (let x = -20; x < 20; ++x) {
      for (let y = -20; y < 20; ++y) {
        globalmap[makeKey(x, y)] = {x, y}
      }      
    }
    const getFromGlobalMap = (key, x, y) => {
      if (globalmap[key]) return globalmap[key];
      globalmap[key] = {x, y};
      return globalmap[key];
    }
    const copyMap = (map) => {
      const res = {};
      for(let k in map) {
        res[k] = map[k]
      }
      return res;
    }
    const getPositions = (state) => {
      const positions = [];
      for (let key in state.map) {
        if (!!state.map[key]) 
          positions.push(state.map[key])
      }
      return positions;
    } 
    const placeNode = (state, nodeId, position) => {
      // console.profile("placeNode");
      const {x: px, y: py} = position;
      const nextState = {
        nodes: {}
      };
      for (let nid in state.nodes) {
        nextState.nodes[nid] = state.nodes[nid]
      }
      nextState.nodes[nodeId] = {x: px, y: py, id: nodeId};
      
      nextState.map = copyMap(state.map)
      nextState.map[makeKey(px, py)] = true;
      
      
      nextState.positions = _.filter(state.positions
        , ({x, y}) => x !== px && y !== py);
        
      nextState.positions = nextState.positions.concat(
        addArray.filter(([addx, addy]) => {
          const key = makeKey(px + addx, py + addy);
          return !nextState.map[key]
        })
        .map(([addx, addy]) => ({x: px+addx,y : py+addy}))
      )
      
      // addArray.forEach(([addx, addy]) => {
      //   if (!_.some(nextState.nodes, ({x, y}) => px + addx === x && py === y + addy)) 
      //     nextState.positions.push({x: px + addx, y: py + addy})
      // })
            
      // console.profileEnd("placeNode");
      return nextState;      
    };
    
    const isValid = (state, constraints) => {
      return constraints.some(constraint => constraint(state))
    }
    
    const getStates = (state, constraints) => {
      const states = [];
      _.forEach(graph.nodes, node => {
        if (!state.nodes[node.id]) {
          state.positions.forEach(position => {
            const nextState = placeNode(state, node.id, position);
            if (isValid(nextState, constraints)) {
              states.push(nextState);
            }
          })
        }
      })
      return states;
    }
    
    let stateStack = [
      placeNode(state, _.first(graph.nodes), {x: 0, y: 0})
    ];
    
    let i = 0, exitState, testState;
    console.time('10000')
    while (stateStack.length !== 0 && ++i <= 10000) {
    // setInterval(() => {
      const state = stateStack.pop();
      if (_.every(graph.nodes, node => state.nodes[node.id])) {
        exitState = state;
        break;
      }
      stateStack = stateStack.concat(getStates(state, constraints))
      testState = state;
      if (i % 10000 === 0) {
        // (new LevelRenderer()).render(graph, state)
        // console.log(stateStack.length, i)
      }
    // }, 100)
    }
    console.timeEnd('10000')
    
    console.log(i)
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

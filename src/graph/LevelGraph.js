const _ = require('lodash');
const {randomInt, randomArray} = require('../Random');

const {LinkType} = require('./MissionGraph');
const {LevelRenderer} = require('./LevelRenderer');

const Geom = require('../Geom');

class Point{ constructor(x = 0, y = 0) {this.x = x; this.y = y;}}
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
      const isect = Geom.isectSegments(n00.x, n00.y, n01.x, n01.y
        , n10.x, n10.y, n11.x, n11.y)
      return isect;
    }]
    
    const constraints = [(state) => {
      for (let p0 = 0; p0 < pairs.length; ++p0) {
        const node00 = state.nodes[pairs[p0].sourceId];
        const node01 = state.nodes[pairs[p0].targetId];
        if (!node00 || !node01) continue;
        if (_.some(edgeChecks, (check) => check(node00, node01))) return false;
      }
      for (let p0 = 0; p0 < pairs.length; ++p0) {
        const pair0 = pairs[p0];
        const node00 = state.nodes[pair0.sourceId];
        const node01 = state.nodes[pair0.targetId];
        if (!node00 || !node01) continue;
        for (let p1 = p0 + 1; p1 < pairs.length; ++p1) {
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
    const placeNode = (state, nodeId, pos) => {
      // console.profile("placeNode");
      const nextState = {
        nodes: _.assign({}, state.nodes)
      };
      nextState.nodes[nodeId] = {x: pos.x, y: pos.y, id: nodeId};
      
      return nextState;      
    };
    const placePositions = (nextState, state, pos) => {
      nextState.map = copyMap(state.map)
      nextState.map[makeKey(pos.x, pos.y)] = true;
      
      nextState.positions = state.positions.filter(
        (p) => pos.x !== p.x && pos.y !== p.y);
        
      nextState.positions = nextState.positions.concat(
        addArray
          .filter(([addx, addy]) => {
            const key = makeKey(pos.x + addx, pos.y + addy);
            return !nextState.map[key]
          })
          .map(([addx, addy]) => new Point(pos.x+addx, pos.y+addy))
      );
      
      return nextState;      
    };
    const placeNodeFull = (state, nodeId, pos) => {
      // console.profile("placeNode");
      const nextState = {
        nodes: _.assign({}, state.nodes)
      };
      nextState.nodes[nodeId] = {x: pos.x, y: pos.y, id: nodeId};
      
      nextState.map = copyMap(state.map)
      nextState.map[makeKey(pos.x, pos.y)] = true;
      
      nextState.positions = state.positions.filter(
        (p) => pos.x !== p.x && pos.y !== p.y);
        
      nextState.positions = nextState.positions.concat(
        addArray
          .filter(([addx, addy]) => {
            const key = makeKey(pos.x + addx, pos.y + addy);
            return !nextState.map[key]
          })
          .map(([addx, addy]) => new Point(pos.x+addx, pos.y+addy))
      );
      
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
            // const nextState = placeNodeFull(state, node.id, position);
            if (isValid(nextState, constraints)) {
              states.push(placePositions(nextState, state, position));
              // states.push(nextState);
            }
          })
        }
      })
      return states;
    }
    
    let stateStack = [
      placePositions(placeNode(
        state
        , _.chain(graph.nodes)
          .keys()
          .first()
          .value()
        , new Point()
      )
      , state
      , new Point())
    ];
    
    let i = 0, exitState, testState;
    // console.time('10000')
    while (stateStack.length !== 0 && ++i <= 10000000) {
    // setInterval(() => {
      const state = stateStack.pop();
      if (_.every(graph.nodes, node => state.nodes[node.id])) {
        exitState = state;
        break;
      }
      stateStack = stateStack.concat(getStates(state, constraints))
      testState = state;
      if (i % 10000 === 0) {
        (new LevelRenderer()).render(graph, exitState || testState)
        console.log(stateStack.length, i)
      }
    // }, 100)
    }
    (new LevelRenderer()).render(graph, exitState || testState)
    // console.timeEnd('10000')
    
    console.log(i, !!exitState)
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
}

module.exports = {LevelGraph}

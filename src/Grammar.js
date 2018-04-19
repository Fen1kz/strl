const {MissionGraph, LinkType} = require('./graph/MissionGraph');

// Start: 'St'
// Exit: 'Ex'
// Space: 'S#'
// Obstacle: 'O#'
// Danger: 'D#'
// Monster: 'M#'
// Level#: 'L#'
// Trap: 'T#'
// Valuable: 'V#'
// Lock: 'L'
// Unlock: 'U'
// Workshop: 'W'
// Door: '+'
// DoorLever: '+l'
// DoorKey: '+k'



module.exports = {
  L0: [
    (() => {
      const graph = new MissionGraph();
      const [start, value, exit] = graph.addNodes('<', '$', '>').map(n => n.id);
      const [s, m, e] = graph.addTriple('').map(n => n.id);
      
      graph.addLink(start, s)
      graph.addLink(exit, e)
      
      graph.addLink(e, value, LinkType.PATH, false)
      graph.addLink(value, s, LinkType.PATH, false)
      
      return graph;
    })
  ]
  , L1: [
    (() => {
      /*
* < - x - >
       */ 
      const graph = new MissionGraph();
      const [start, center, exit] = graph.addNodes(
        '<', 'L3', '>'
      ).map(n => n.id);
      graph.addLink(start, center);
      graph.addLink(exit, center);
      return graph;
    })
  ]
  , 'L2': [
    (() => {
      /*
*     M - $
*     |
* < -(|)- >
       */ 
      const graph = new MissionGraph();
      const [start, exit, monster, value] = graph.addNodes('<', '>', 'M', '$').map(n => n.id);
      const [s,m,e] = graph.addTriple().map(n => n.id);
      graph.addLink(start, s);
      graph.addLink(monster, m);
      graph.addLink(monster, value);
      graph.addLink(exit, e);
      return graph;
    })
    , (() => {
      /*
*     L - $
*     |
* < -(|)- >
*     |
*     M - K
       */ 
      const graph = new MissionGraph();
      const [start, exit] = graph.addNodes('<', '>').map(n => n.id);
      const [lock, value, monster, key] = graph.addNodes('L', '$', 'M', 'K').map(n => n.id);
      const [s,m,e] = graph.addTriple().map(n => n.id);
      graph.addLink(start, s);
      graph.addLink(exit, e);
      
      graph.addLink(m, monster);
      graph.addLink(monster, key);
      graph.addLink(key, lock, LinkType.LOGIC);      
      graph.addLink(m, lock);
      graph.addLink(lock, value);
      
      return graph;
    })
  ]
  , 'L3': [
    (() => {
      const graph = new MissionGraph();
      const [start, secret, value, exit] = graph.addNodes('<', '%', '$', '>').map(n => n.id);
      const [key1, key2, lock1, lock2] = graph.addNodes('K', 'K', 'L', 'L').map(n => n.id);
      const [s0, m0, e0] = graph.addTriple().map(n => n.id);
      const [s1, m1, e1] = graph.addTriple().map(n => n.id);
      const [s2, m2, e2] = graph.addTriple().map(n => n.id);
      
      graph.addLink(start, s1)
      
      graph.addLink(secret, e0, LinkType.PATH, false)
      graph.addLink(secret, key2)
      
      graph.addLink(value, exit)
      graph.addLink(value, lock2)
         
      graph.addLink(exit, key2)
      graph.addLink(exit, lock1)
      
      graph.addLink(key1, s0)
      graph.addLink(key1, e1)
      graph.addLink(key1, lock1, LinkType.LOGIC)
        
      graph.addLink(key2, lock2, LinkType.LOGIC)
      
      graph.addLink(lock1, m1)
      graph.addLink(lock2, m2)
      
      graph.addLink(m1, s2)

      return graph;
    })
  ]
}

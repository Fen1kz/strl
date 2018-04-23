const Grammar = require('./Grammar');
const {randomArray} = require('./Random');
const {MissionGraph, LinkType} = require('./graph/MissionGraph');
const {LevelGraph} = require('./graph/LevelGraph');
const _ = require('lodash');

const generateMission = (missionString, complexity = 3) => {
  const grammarKeys = Object.keys(Grammar)

  
  const replace = (graph, replaceKey) => {    
    const replaceGraph = randomArray(Grammar[replaceKey])();
    
    return graph.merge(replaceGraph);
  }
  
  // const initialGraph = randomArray(Grammar.L0)();
  // 
  // replace(initialGraph, 'L3')
  // replace(initialGraph, 'L2')
  // let result = true;
  // while (result) {
  //   result = replace(initialGraph, 'L1')
  // }
  
  // console.log(initialGraph.toTable())
  // console.log(_.filter(initialGraph.nodes, (node) => node.name === 's')[4])
  const lvlg = (() => {
    const graph = new MissionGraph();
    const [start, space, monster, treasure, exit] = graph.addNodes(
      '<', 's', 'M', '$', '>'
    ).map(n => n.id);
    graph.addLink(start, space);
    graph.addLink(space, monster);
    graph.addLink(monster, exit);
    graph.addLink(exit, treasure, LinkType.PATH, false);
    graph.addLink(treasure, start, LinkType.PATH, false);
    
    return graph;
  })()
  
  const levelGraph = new LevelGraph(lvlg);
  
}

console.log(generateMission())

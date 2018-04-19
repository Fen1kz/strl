const Grammar = require('./Grammar');
const {randomArray} = require('./Random');
const {MissionGraph, LinkType} = require('./graph/MissionGraph');
const {LevelGraph} = require('./graph/LevelGraph');
const _ = require('lodash');

const generateMission = (missionString, complexity = 3) => {
  const grammarKeys = Object.keys(Grammar)
  
  const initialGraph = randomArray(Grammar.L0)();

  
  const replace = (graph, replaceKey) => {    
    const replaceGraph = randomArray(Grammar[replaceKey])();
    
    return graph.merge(replaceGraph);
  }
  
  replace(initialGraph, 'L3')
  replace(initialGraph, 'L2')
  let result = true;
  while (result) {
    result = replace(initialGraph, 'L1')
  }
  
  // console.log(initialGraph.toTable())
  const lvlg = (() => {
    const graph = new MissionGraph();
    const [start, space, monster, exit] = graph.addNodes(
      '<', 's', 'M', '>'
    ).map(n => n.id);
    graph.addLink(start, space);
    graph.addLink(space, exit);
    graph.addLink(start, monster, LinkType.PATH, false);
    graph.addLink(monster, exit, LinkType.PATH, false);
    return graph;
  })()
  
  const levelGraph = new LevelGraph(lvlg);
  
}

console.log(generateMission())

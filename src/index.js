const Area = require('./Area');
const {Graph, Node, Edge} = require('./Graph');

const MissionType = {
  Infiltration: {
    AreasReq: [
      new Node('>')
      , new Node('<')
    ]
  }
}

const getMission = (missionType, size) => {
  const graph = new Graph();
  missionType.AreasReq.forEach(ar => graph.addNode(ar))
  const Start = graph.nodes.find(n => n.value === '>')
  const Exit = graph.nodes.find(n => n.value === '<')
  const Objectives = graph.nodes.filter(n => n.value === Area.Objective)
  
  const nodes = graph.nodes.slice();
  const start = nodes.shift()
  console.log(start, nodes)
  
  return `
nodes: [${graph.nodes}]  
edges: [${graph.edges}]  
`;
}

console.log(getMission(MissionType.Infiltration, 1))

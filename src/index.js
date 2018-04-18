const Grammar = require('./Grammar');
const {randomArray} = require('./Random');
const {MissionGraph, LinkType} = require('./MissionGraph');


const generateMission = (missionString, complexity = 3) => {
  const grammarKeys = Object.keys(Grammar)
  // const graph = new MissionGraph();

  const hardGraph1 = (() => {
    const graph = new MissionGraph();
    const [start, secret, value, exit] = graph.addNodes('<', '%', '$', '>');
    const [key1, key2, lock1, lock2] = graph.addNodes('K', 'K', 'L', 'L');
    const [s0, m0, e0] = graph.addTriple('sML');
    const [s1, m1, e1] = graph.addTriple('sML');
    const [s2, m2, e2] = graph.addTriple('sML');
    
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
  })()
  
  const ezGraph = (() => {
    const graph = new MissionGraph();
    const [start, value1, value2, exit] = graph.addNodes('<', '$', '$', '>');
    const [s, m, e] = graph.addTriple('');
    
    graph.addLink(start, s)
    graph.addLink(exit, e)
    
    graph.addLink(e, value1, LinkType.PATH, false)
    graph.addLink(value1, s, LinkType.PATH, false)
    
    graph.addLink(value2, m)
    
    return graph;
  })()
  
  const analyse = (graph) => {
    return Object.values(graph.nodes).filter(node => node.value === '|');
  }
  
  const graph = ezGraph
  
  console.log(graph.toTable())
  
  const m = randomArray(analyse(graph))
  const s = graph.nodes[graph.getLinksOf(m).find(([nodeId, type]) => type === LinkType.START)[0]]
  const e = graph.nodes[graph.getLinksOf(m).find(([nodeId, type]) => type === LinkType.END)[0]]
  
  const replaceGraph = randomArray(Grammar.nds)()
  console.log(replaceGraph.toTable())
  
  const filterTypes = ([nodeId, type]) => type !== LinkType.START && type !== LinkType.MIDDLE && type !== LinkType.END;
  
  const sOut = graph.getLinksOf(s).filter(filterTypes);
  const sIn = graph.getLinksTo(s).filter(filterTypes);
  
  const eOut = graph.getLinksOf(e).filter(filterTypes);
  const eIn = graph.getLinksTo(e).filter(filterTypes);
  
  const mOut = graph.getLinksOf(m).filter(filterTypes);
  const mIn = graph.getLinksTo(m).filter(filterTypes);
  
  while (mOut.length > 0) randomArray([sOut, eOut]).push(mOut.shift())
  while (mIn.length > 0) randomArray([sIn, eIn]).push(mIn.shift())
  
  const replaceStart = Object.values(replaceGraph.nodes).find(node => node.value === '<')
  replaceStart.value = 's';
  const replaceExit = Object.values(replaceGraph.nodes).find(node => node.value === '>')
  replaceExit.value = 's';
  
  sOut.map(([nodeId, type]) => replaceGraph
    .addLink(replaceStart, graph.nodes[nodeId], type, false))
  sIn.map(([nodeId, type]) => replaceGraph
    .addLink(graph.nodes[nodeId], replaceStart, type, false))
  eOut.map(([nodeId, type]) => replaceGraph
    .addLink(replaceExit, graph.nodes[nodeId], type, false))
  eIn.map(([nodeId, type]) => replaceGraph
    .addLink(graph.nodes[nodeId], replaceExit, type, false))
    
  Object.values(replaceGraph.nodes).forEach(node => graph.addNode(node))
  
  graph.delNode(s);
  graph.delNode(e);
  graph.delNode(m);
  
  console.log(graph.toTable())
  
      
//   const St = graph.addNode(new MissionGraph.Node('St'))
//   const Ex = graph.addNode(new MissionGraph.Node('Ex'))
// 
//   const rules = {
//     'E F I': {
//       links: `
// 0 0 1
// 0 0 1
// 0 0 0
// `
//     }
//   }

  // console.log(test1.sub(
  //   test1.find('E')
  //   , test1.find('E F I').toTable())
  
  // console.log(graph.getLinksFrom(0), graph.getLinksFrom(1))
  // console.log(graph.getLinksTo(0), graph.getLinksTo(1))
  
  // let changed = true;
  // while (changed) {
  //   changed = graph.nodes.some((node1) => {
  //     changed = graph.getLinksFrom(node1.id).some((node2) => {
  //       console.log(`${node1.value} check link ${node2.value}`)
  //       const replaceRule = Grammar[node1.value + ' ' + node2.value];
  //       if (replaceRule) {
  //         console.log(`${node1.value} REPLACED ${node2.value}`)
  //         const replacePack = randomArray(replaceRule)
  //         const replaceGraph = MissionGraph.fromPack(replacePack);
  //         // console.log(variant.toTable())
  // 
  //         // graph.getLinksFrom(node1.id).forEach(node => {
  //         //   outputs1.push(node.id)
  //         // })
  //         // graph.getLinksTo(node1.id).forEach(node => {
  //         //   inputs1.push(node.id)
  //         // })
  //         // graph.getLinksFrom(node2.id).forEach(node => {
  //         //   outputs2.push(node.id)
  //         // })
  //         // graph.getLinksTo(node1.id).forEach(node => {
  //         //   inputs2.push(node.id)
  //         // })
  // 
  //         graph.delLink(node1.id, node2.id);
  //         graph.merge(replaceGraph, [node1.id], [node2.id]);
  //         changed = true;
  //         return true;
  //       }
  //     })
  //     if (changed) return true;
  //     const replaceRule = Grammar[node1.value];
  //     if (replaceRule) {
  //       console.log(`${node1.value} REPLACE`)
  //       const replacePack = randomArray(replaceRule)
  //       const replaceGraph = MissionGraph.fromPack(replacePack);
  //       const inputs = [];
  //       const outputs = [];
  //       graph.getLinksFrom(node1.id).forEach(node => {
  //         outputs.push(node.id)
  //       })
  //       graph.getLinksTo(node1.id).forEach(node => {
  //         inputs.push(node.id)
  //       })
  //       graph.delNode(node1.id);
  //       graph.merge(replaceGraph, inputs, outputs);
  //       return true
  //     }
  //   })    
    // console.log('checking graph', changed)
  // }
  
  function replaceGrammar(item) {
    
  }
  // console.log(MissionGraph.fromPack(Grammar['St Ex'][0]).toTable())
  // console.log(graph.merge(MissionGraph.fromPack(Grammar['St Ex'][0])))
  // console.log(graph.merge(MissionGraph.fromPack(Grammar['St Ex'][0])).toTable())
  // while (true) {
  //   let index;
  //   grammarKeys.some(search => {
  //     index = missionString.indexOf(search);
  //     return ~index;
  //   })
  //   if (!~index) break;
  //   const start = missionString.slice(0, index);
  //   const end = missionString.slice(index+2);
  //   const center = randomArray(Grammar[missionString.slice(index, index+2)])
  //   missionString = start + center + end;
  // }
}

console.log(generateMission())

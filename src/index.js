const Grammar = require('./Grammar');
const {randomArray} = require('./Random');
const {MissionGraph} = require('./MissionGraph');


const generateMission = (missionString) => {
  const grammarKeys = Object.keys(Grammar)
  // const graph = new MissionGraph();
  
const graph = MissionGraph.fromTable(`
    S s s E
  S 0 1 1 0
  s 0 0 0 1
  s 0 0 0 1
  E 0 0 0 0
`)

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

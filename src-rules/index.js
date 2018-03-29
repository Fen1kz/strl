const {AreaKey, AreaItemKey} = require('./Keys');
const {Area, AreaDef} = require('./Area');
const {AreaItem, AreaItemDef} = require('./AreaItem');
const {Graph, Node, Edge} = require('./Graph');
const {random, randomChance, randomArray} = require('./Random')

const MissionType = {
  Infiltration: {
    Items: [
      AreaItemKey.Start
      , AreaItemKey.Workshop
      , AreaItemKey.Treasure
      , AreaItemKey.Treasure
      , AreaItemKey.Treasure
      , AreaItemKey.Treasure
      , AreaItemKey.Trap
      , AreaItemKey.Trap
      , AreaItemKey.Exit
    ]
  }
}

const value = (value) => n => n.value === value;

const getNode = (graph) => {
  const possibleTypes = Object.values(Area);
  const type = getRandom(possibleTypes)
  // const areas = 
  return new Node(type)
}

const makeAreaForItem = (ai) => {
  const area = new Area(randomArray(AreaItemDef[ai.key].Area))
  area.addItem(ai)
  return area;
}

const getMission = (missionType, size, complexity) => {
  const graph = new Graph();
  const areas = [];
  const areaItems = missionType.Items.map((aik) => new AreaItem(aik))
  
  areaItems.forEach(areaItem => {
    // console.log(`----- ----- Placing ${areaItem}`)
    if (!areas.some(area => {
      // console.log(`----- Trying area ${area}`)
      const areaSupportsItem = (AreaDef[area.key].Rules || [])
        .every(rule => rule(area, areaItem))
      const itemSupportsArea = areaSupportsItem 
        && (AreaItemDef[areaItem.key].Rules || [])
          .some((ruleOr) => ruleOr.every(ruleAnd => ruleAnd(area, areaItem)))
      const areaItemsSupportItem = itemSupportsArea
        && area.items
          .every(item => (AreaItemDef[item.key].Rules || [])
            .some((ruleOr) => ruleOr.every(ruleAnd => ruleAnd(area, areaItem))))
      // console.log(`Area: ${area} ASI ${areaSupportsItem} ISA ${itemSupportsArea} AISI ${areaItemsSupportItem}`)
      if (areaSupportsItem && itemSupportsArea && areaItemsSupportItem) {
        area.addItem(areaItem)
        return true;
      }
    })) {
      areas.push(makeAreaForItem(areaItem));
      const corridors = areas.filter(area => area.key === AreaKey.Corridor).length
      const others = areas.length - corridors;
      if (corridors < others * .66) areas.push(new Area(AreaKey.Corridor))
    }
    console.log(`${areas}`)
    // const area = makeAreaForItem(areaItem)
  });
  
  const nodes = areas.map(a => new Node(a))
  nodes.forEach(n => graph.addNode(n))
  
  let nodeL = nodes.shift()
  let nodeR = nodes.shift()
  let nodeC = nodes.shift()
  
  const attached = [];
  attached.push(nodeL);
  attached.push(nodeR);
  
  while (nodeC) {
    const rndValue = random();
    // CONNECT_BOTH 111
    // CONNECT_RIGHT 101
    // CONNECT_LEFT 110
    // INVERSE_CENTER 011
    if (rndValue < .25) {
      console.log('111')
      graph.addEdge(nodeL, nodeR)
      graph.addEdge(nodeC, nodeL)
      graph.addEdge(nodeC, nodeR)
    } else if (rndValue < .5) {
      console.log('101')
      graph.addEdge(nodeL, nodeR)
      graph.removeEdge(nodeC, nodeL)
      graph.addEdge(nodeC, nodeR)
    } else if (rndValue < .75) {
      console.log('110')
      graph.addEdge(nodeL, nodeR)
      graph.addEdge(nodeC, nodeL)
      graph.removeEdge(nodeC, nodeR)
    } else {
      console.log('011')
      graph.removeEdge(nodeL, nodeR)
      graph.addEdge(nodeC, nodeL)
      graph.addEdge(nodeC, nodeR)
    }
    nodeL = randomArray(attached);
    nodeR = randomArray(attached);
    attached.push(nodeC);
    nodeC = nodes.shift();
  }
  
  
  // const Start = new Area(AreaKey.Room)
  // Start.addItem(new AreaItem(AreaItemKey.Start))
  // const Exit = new Area(AreaKey.Room)
  // Exit.addItem(new AreaItem(AreaItemKey.Exit))
  // graph.addNode(Start)
  // graph.addNode(Exit)
  
  // const Exit = new Node(AreaItemKey.Exit)
  // graph.addNode(Exit)
  // graph.addEdge(Start, Exit, 1 & 2)
  
  // (size)
  
  // while (graph.nodes.length < size) {
  //   const node = getNode(missionType, graph)
  //   graph.addNode(node)
  // }
  
  // const Objectives = graph.nodes.filter(value(Area.Objective))
  
  // const nodes = graph.nodes.slice();
  // const start = nodes.shift()
  // console.log(start, nodes)
  
  return `
nodes: [${graph.nodes}]  
edges: [${graph.edges}]  
`;
}

console.log(getMission(MissionType.Infiltration, 4, 0))

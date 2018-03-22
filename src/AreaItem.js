const {AreaKey, AreaItemKey} = require('./Keys');
const {randomChance} = require('./Random');


const AreaItemRule = {
  ALONE: () => (area, areaItem) => {
    // console.log(`ALONE: ${area} + ${areaItem}: ${area.items.length === 0}`)
    return area.items.length === 0
  }
  , NOT_ALONE: () => (area, areaItem) => {
    // console.log(`NOT ALONE: ${area} + ${areaItem}: ${area.items.length > 0}`)
    return area.items.length > 0
  }
  , AREA: (areaKey) => (area) => {
    // console.log(`AREA: ${area} is ${areaKey}: ${area.key === areaKey}`)
    return area.key === areaKey
  }
  , NO_ITEM: (aik) => (area, areaItem) => {
    // console.log(`NO_ITEM(${aik}): ${area} + ${areaItem}: ${!area.items.some(ai => ai.key === aik)}`)
    return !area.items.some(ai => ai.key === aik) 
  }
  , MAX_COPIES: (n) => (area, areaItem) => {
    // console.log(`MAX_COPIES(${n}): ${area}: ${area.items.length < n}`)
    return area.items.length < n
  }
  , CHANCE: (n) => (area, areaItem) => {
    // console.log(`CHANCE${n}: ${area}: ${randomChance(n)}`)
    return randomChance(n)
  }
}
const AIR = AreaItemRule;

const AreaItemDef = {
  [AreaItemKey.Start]: {
    Area: [AreaKey.Room]
    , Rules: [[AIR.AREA(AreaKey.Room), AIR.ALONE()]]
  }
  , [AreaItemKey.Exit]: {
    Area: [AreaKey.Room]
    , Rules: [[AIR.AREA(AreaKey.Room), AIR.ALONE()]]
  }
  , [AreaItemKey.Objective]: {
    Area: [AreaKey.Room, AreaKey.Danger]
    , Rules: [[AIR.AREA(AreaKey.Room)], [AIR.AREA(AreaKey.Danger)]]
  }
  , [AreaItemKey.Workshop]: {
    Area: [AreaKey.Room]
    , Rules: [[AIR.AREA(AreaKey.Room), AIR.NO_ITEM(AreaItemKey.Trap)]]
  }
  , [AreaItemKey.Treasure]: {
    Area: [AreaKey.Room, AreaKey.Danger, AreaKey.Secret]
    , Rules: [      
        [AIR.AREA(AreaKey.Secret)]
        , [AIR.AREA(AreaKey.Room), AIR.CHANCE(.2)]
        , [AIR.AREA(AreaKey.Corridor), AIR.CHANCE(.1)]
    ]
  }
  , [AreaItemKey.Trap]: {
    Area: [AreaKey.Corridor]
    , Negative: true
    , Rules: [
      [AIR.AREA(AreaKey.Room), AIR.NO_ITEM(AreaItemKey.Workshop)]
      , [AIR.AREA(AreaKey.Danger), AIR.NO_ITEM(AreaItemKey.Workshop), AIR.NOT_ALONE()]
      , [AIR.AREA(AreaKey.Secret), AIR.NO_ITEM(AreaItemKey.Workshop), AIR.NOT_ALONE()]
      , [AIR.AREA(AreaKey.Corridor)]
    ]
  }
  , [AreaItemKey.Unlock]: {
    Area: [AreaKey.Room, AreaKey.Danger, AreaKey.Corridor]
  }
}

class AreaItem {
  constructor(key) {
    this.key = key;
  }
  
  toString() {
    return this.key
  }
}

module.exports = {
  AreaItem
  , AreaItemKey
  , AreaItemDef
}

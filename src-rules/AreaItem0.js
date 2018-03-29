const {AreaKey} = require('./Area');

const AreaItemKey = {
  Start: 'S'
  , Exit: 'E'
  , Objective: 'O' // Primary mission objective
  , Workshop: 'W' // Aka temple
  , Treasure: 'V'
  , Trap: 'T'
  , Unlock: 'U' // Requested unlocks
}

const AreaItemRule = {
  NO_ITEM: (aik) => (area, areaItem) => {
    console.log(`NO_ITEM(${aik}): ${area} + ${areaItem} = ${!area.items.some(ai => ai.key === aik)}`)
    return !area.items.some(ai => ai.key === aik) 
  }
  , NOT_ALONE: () => (area, areaItem) => {
    console.log(`NOT ALONE: ${area} + ${areaItem} = ${area.items.length > 0}`)
    return area.items.length > 0
  }
  , ALONE: () => (area, areaItem) => {
    console.log(`ALONE: ${area} + ${areaItem} = ${area.items.length === 0}`)
    return area.items.length === 0
  }
}

const AreaItemDef = {
  [AreaItemKey.Start]: {
    Rules: [
      [AreaItemRule.ALONE()]
    ]
    , NewArea: [AreaKey.Room]
    , Rules: [AreaItemRule.ALONE()]
  }
  , [AreaItemKey.Exit]: {
    Area: [AreaKey.Room]
    , Rules: [AreaItemRule.ALONE()]
  }
  , [AreaItemKey.Objective]: {
    Area: [AreaKey.Room, AreaKey.Danger]
  }
  , [AreaItemKey.Workshop]: {
    Area: [AreaKey.Room]
    , Rules: [AreaItemRule.NO_ITEM(AreaItemKey.Trap)]
  }
  , [AreaItemKey.Treasure]: {
    Area: [AreaKey.Room, AreaKey.Danger, AreaKey.Corridor, AreaKey.Secret]
  }
  , [AreaItemKey.Trap]: {
    Area: [AreaKey.Room, AreaKey.Danger, AreaKey.Corridor, AreaKey.Secret]
    , Rules: [
      AreaItemRule.NO_ITEM(AreaItemKey.Workshop)
    ]
    , AreaRules: {
      [AreaKey.Danger]: [AreaItemRule.NOT_ALONE()]
      , [AreaKey.Secret]: [AreaItemRule.NOT_ALONE()]
    }
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

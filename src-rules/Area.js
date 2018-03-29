const {randomChance} = require('./Random');
const {AreaKey} = require('./Keys')
const {AreaItemDef} = require('./AreaItem')

const AreaRule = {
  MAX_ITEMS: (n) => (area, areaItem) => {
    // console.log(`[A]MAX_ITEMS(${n}): ${area}: ${area.items.length < n}`)
    return area.items.length < n
  }
  , CHANCE: () => (area, areaItem) => {
    const ail = area.items.length;
    if (AreaItemDef[areaItem.key].Negative) {
      const chance = (ail*ail) / (1 + (ail*ail));
      // console.log(`[A]CHANCE(${chance}): ${area}: ${randomChance(chance)}`)
      return randomChance(chance)
    } else  {
      const chance = ((4 - ail) / 4);
      // console.log(`[A]CHANCE(${(1 / (ail + 1))}): ${area}: ${randomChance(chance)}`)
      return randomChance(chance)
    } 
  }
  // NO_ITEM: (aik) => (area, areaItem) => {
  //   console.log(`NO_ITEM(${aik}): ${area} + ${areaItem} = ${!area.items.some(ai => ai.key === aik)}`)
  //   return !area.items.some(ai => ai.key === aik) 
  // }
  // , NOT_ALONE: () => (area, areaItem) => {
  //   console.log(`NOT ALONE: ${area} + ${areaItem} = ${area.items.length > 0}`)
  //   return area.items.length > 0
  // }
  // , ALONE: () => (area, areaItem) => {
  //   console.log(`ALONE: ${area} + ${areaItem} = ${area.items.length === 0}`)
  //   return area.items.length === 0
  // }
}

const AreaDef = {
  [AreaKey.Room]: {
    Rules: [AreaRule.MAX_ITEMS(2), AreaRule.CHANCE()]
  }
  , [AreaKey.Secret]: {
    Rules: [AreaRule.MAX_ITEMS(2), AreaRule.CHANCE()]
  }
  , [AreaKey.Danger]: {
    Rules: [AreaRule.MAX_ITEMS(2), AreaRule.CHANCE()]
  }
  , [AreaKey.Corridor]: {
    Rules: [AreaRule.MAX_ITEMS(1), AreaRule.CHANCE()]
  }
}

class Area {
  constructor(key) {
    this.key = key;
    this.id = Math.random().toFixed(2).substr(3, 1)
    this.items = [];
  }
  
  addItem(areaItem) {
    this.items.push(areaItem)
  }
  
  toString() {
    return `${this.key[0]}${this.key === AreaKey.Corridor ? this.id : ''}${this.items}${this.key[1]}`
  }
}

module.exports = {
  Area
  , AreaKey
  , AreaDef
}

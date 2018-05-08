const seed = require('seed-random')

const random = seed('tests');

module.exports = {
  random
  , randomInt: (min, max) => min + (Math.floor(random() * (max - min)))
  , randomChance: (chance) => random() < chance 
  , randomArray: array => array[Math.floor(random() * array.length)]
}

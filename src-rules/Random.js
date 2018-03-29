const seed = require('seed-random')

const random = seed('tests');

module.exports = {
  random
  , randomChance: (chance) => random() < chance 
  , randomArray: array => array[Math.floor(random() * array.length)]
}

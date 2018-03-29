const AreaKey = {
  Room: '()'
  , Secret: '$$'
  , Danger: '{}'
  , Corridor: '=='
}


const AreaItemKey = {
  Start: 'S'
  , Exit: 'E'
  , Objective: 'O' // Primary mission objective
  , Workshop: 'W' // Aka temple
  , Treasure: 'V'
  , Trap: 'T'
  , Unlock: 'U' // Requested unlocks
}

module.exports = {
  AreaKey
  , AreaItemKey
}

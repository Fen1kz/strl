// Start: 'St'
// Exit: 'Ex'
// Space: 'S#'
// Obstacle: 'O#'
// Danger: 'D#'
// Monster: 'M#'
// Level#: 'L#'
// Trap: 'T#'
// Valuable: 'V#'
// Lock: 'L'
// Unlock: 'U'
// Workshop: 'W'
// Door: '+'
// DoorLever: '+l'
// DoorKey: '+k'

module.exports = {
  'St Ex': [
    {
      nodes: 'St Cp Ex'
      , links: `0 1 0\n0 0 1`
      , endpoints: [
        [0]
        , [2]
      ]
    }
  ]
  , 'Cp': [
    {
      nodes: 'Cs Cl Cl Cl Ce'
      , links: `
0 1 1 1 0
0 0 0 0 1
0 0 0 0 1
0 0 0 0 1
      `
      , input: [0]
      , output: [4]
    }
  ]
  , 'Cl': [
    {
      nodes: 'Un Tr Lo'
      , links: `0 1 0\n0 0 1`
      , input: [0]
      , output: [2]
    }
    , {
      nodes: 'Un Lo'
      , links: `0 1\n0 1`
      , input: [0]
      , output: [1]
    }
  ]
}




// module.exports = {
//   'STEX': []
//   , 'S1': ['s']
//   , 'O1': ['+']
//   , 'D1': ['M1']
//   , 'L1': ['S1', 'D1', 'O1']
// 
//   , 'S2': ['S1S1', 'S1O1'] // ss, s+
//   , 'O2': ['O1'] // +
//   , 'D2': ['M1', 'T1'] // m, t
//   , 'L2': ['S1L1']  // ss, ms, +s
// 
//   , 'S3': ['S2S1', 'S2S2', 'S2O2']
//   , 'O3': ['UL2+#']
//   , 'D3': ['M1', 'T1']
//   , 'L3': ['S1L1']
// }

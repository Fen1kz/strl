const {MissionGraph} = require('./MissionGraph');

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
  '> <': [MissionGraph.fromTable(`
  < K K s s L L $ > X
< - 0 0 1 0 0 0 0 0 0
K 0 - 0 1 0 2 0 0 0 1
K 0 0 - 0 0 0 2 0 1 1
s 1 1 0 - 1 1 0 0 0 0 
s 0 0 0 1 - 0 1 0 0 0
L 0 2 0 1 0 - 0 0 1 0
L 0 0 2 0 1 0 - 1 0 0
$ 0 0 0 0 0 0 1 - 1 0
> 0 0 1 0 0 1 0 1 - 0
X 0 1 1 0 0 0 0 0 0 -
`), MissionGraph.fromTable(`
  < s M $ >
< - 1 0 0 0
s 1 - 1 0 1
M 0 1 - 1 0
$ 0 0 1 - 0
> 0 1 0 0 -
`), MissionGraph.fromTable(`
  < s M K L $ >
< - 1 0 0 0 0 0
s 1 - 1 0 1 0 1
M 0 1 - 1 0 0 0
K 0 0 1 - 2 0 0
L 0 1 0 2 - 1 0
$ 0 0 0 0 1 - 0
> 0 1 0 0 0 0 -
`)]
//       , input: [0]
//       , output: [2]
//     }
//     , {
//       nodes: 'Un Lo'
//       , links: `0 1\n0 1`
//       , input: [0]
//       , output: [1]
//     }
//   ]
}

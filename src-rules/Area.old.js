const Area = {
  Start: 'S'
  , Exit: 'E'
  , Objective: 'O'
  , Corridor: 'X'
  , Workshop: 'W'
  , Danger: 'D'
  , Treasure: 'V'
  , Secret: '$'
}

const AreaDef = {
  [Area.Start]: {
    Required: [[Area.Corridor]]
    , Optional: [] //[Area.Workshop, Area.Treasure]
    , chance: 0
  }
  , [Area.Exit]: {
    Required: [[Area.Corridor, Area.Danger]]
    , Optional: [Area.Workshop, Area.Secret, Area.Treasure]
    , chance: 0
  }
  , [Area.Objective]: {
    Required: [[Area.Corridor, Area.Danger]]
    , Optional: [Area.Workshop]
  }
  , [Area.Corridor]: {
    Required: [Object.values(Area), Object.values(Area)]
    , Optional: Object.values(Area)
  }
  , [Area.Workshop]: {
    Required: [[Area.Corridor, Area.Danger]]
    , Optional: Object.values(Area)
  }
  , [Area.Danger]: {
    Required: [[Area.Corridor][Area.Objective, Area.Exit, Area.Treasure]]
    , Optional: Object.values(Area)
  }
  , [Area.Treasure]: {
    Required: [[Area.Corridor, Area.Objective, Area.Exit, Area.Treasure]]
    , Optional: Object.values(Area)
  }
  , [Area.Secret]: {
    Required: [[Area.Corridor, Area.Treasure, Area.Workshop, Area.Danger]]
    , Optional: Object.values(Area)
  }
}

module.exports = {
  Area
  , AreaDef
}
// S(X)[XWD]
// E(X)[XWD$]
// O(XD)[XWD]
// X(SEOXWD$)[SEOXWD$]
// W(XO)[SEOXWD$]
// D(X)[SEOXWD$]
// $(X)[EXWD]

// export const story = `
// infiltrate
// proceed
// artifact
// capture
// `
// import Mission from './Mission';

export class Story {
  constructor(levels = []) {
    this.levels = levels;
  }
}

export const defaultStory = new Story(
  // new Mission.Infiltrate()
  // , new Mission.Proceed()
  // , new Mission.Artifact()
  // , new Mission.Capture()
)

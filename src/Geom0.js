class Geom {
  getBbx(x1, y1, x2, y2) {
    const xd = x1 < x2;
    const yd = y1 < y2;
    return [
      xd ? x1 : x2
      , yd ? y1 : y2
      , xd ? x2 : x1
      , yd ? y2 : y1
    ]
  }
  
  isectBbx([x1, y1, x2, y2], [x3, y3, x4, y4]) {
    return x1 <= x4 
        && x2 >= x3 
        && y1 <= y4
        && y2 >= y3
  }
  
  isectBbxWeak([x1, y1, x2, y2], [x3, y3, x4, y4]) {
    return x1 < x4 
        && x2 > x3 
        && y1 < y4
        && y2 > y3
  }
  
  crossp(x1, y1, x2, y2) {
    return x1*y2 - x2*y1;
  }
  
  isPointOnLine(x1, y1, x2, y2, x3, y3) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const tx = x3 - x1;
    const ty = y3 - y1;
    const cross = this.crossp(dx, dy, tx, ty);
    return Math.abs(cross) < 0.1;
  }
  
  pointLineOrientation(x1, y1, x2, y2, x3, y3) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const tx = x3 - x1;
    const ty = y3 - y1;
    const cross = this.crossp(dx, dy, tx, ty);
    return Math.sign(this.crossp(dx, dy, tx, ty));
  }
  
  pointsEqual(x1, y1, x2, y2) {
    return x1 === x2 && y1 === y2;
  }
  
  segmentCrossLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    const plo1 = this.pointLineOrientation(x3, y3, x4, y4, x1, y1)
    const plo2 = this.pointLineOrientation(x3, y3, x4, y4, x2, y2)
    // console.log(`(${x1},${y1}) is on [(${x3},${y3}),(${x4},${y4})]`, (!this.pointsEqual(x3, y3, x1, y1) 
    //   && !this.pointsEqual(x4, y4, x1, y1) 
    //   && this.isPointOnLine(x3, y3, x4, y4, x1, y1)
    // ), this.isPointOnLine(x3, y3, x4, y4, x1, y1))
    // console.log(`(${x2},${y2}) is on [(${x3},${y3}),(${x4},${y4})]`, (!this.pointsEqual(x3, y3, x2, y2) 
    //   && !this.pointsEqual(x4, y4, x2, y2) 
    //   && this.isPointOnLine(x3, y3, x4, y4, x2, y2)
    // ), this.isPointOnLine(x3, y3, x4, y4, x2, y2))
    // console.log(`orient of (${x1},${y1}) to [(${x3},${y3}),(${x4},${y4})]: ${plo1}`)
    // console.log(`orient of (${x2},${y2}) to [(${x3},${y3}),(${x4},${y4})]: ${plo2}`)
    return (
      (!this.pointsEqual(x3, y3, x1, y1) 
        && !this.pointsEqual(x4, y4, x1, y1) 
        && this.isPointOnLine(x3, y3, x4, y4, x1, y1)
      )
      || (!this.pointsEqual(x3, y3, x2, y2) 
        && !this.pointsEqual(x4, y4, x2, y2) 
        && this.isPointOnLine(x3, y3, x4, y4, x2, y2)
      )
      || (plo1 === 0 && plo2 === 0)
      || (plo1 !== 0 && plo2 !== 0 && plo1 !== plo2)
    );
  }
  
  isectSegments(x1, y1, x2, y2, x3, y3, x4, y4) {
    const compare = (
         this.pointsEqual(x1, y1, x3, y3)
      || this.pointsEqual(x1, y1, x4, y4)
      || this.pointsEqual(x2, y2, x3, y3)
      || this.pointsEqual(x2, y2, x4, y4)
    ) ? this.isectBbxWeak : this.isectBbx
        return (
      compare(
        this.getBbx(x1, y1, x2, y2), this.getBbx(x3, y3, x4, y4)
      )
      && this.segmentCrossLine(x1, y1, x2, y2, x3, y3, x4, y4)
      && this.segmentCrossLine(x3, y3, x4, y4, x1, y1, x2, y2)
    )
  }
}

module.exports = new Geom();

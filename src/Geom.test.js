const Geom = require('./Geom');

test('.getBbx', () => {
  expect(Geom.getBbx(0, 0, 1, 1)).toEqual([0, 0, 1, 1])
  expect(Geom.getBbx(0, 0, -1, -1)).toEqual([-1, -1, 0, 0])
  expect(Geom.getBbx(-1, 1, 1, -1)).toEqual([-1, -1, 1, 1])
})

test('.isectBbx', () => {
  expect(Geom.isectBbx(...[-4, -4, 4, 4], ...[-2, -2, 2, 2])).toBe(true)
  expect(Geom.isectBbx(...[-4, -4, 4, 4], ...[-5, -2, 2, 2])).toBe(true)
  expect(Geom.isectBbx(...[-4, -4, 4, 4], ...[-2, -5, 2, 2])).toBe(true)
  expect(Geom.isectBbx(...[-4, -4, 4, 4], ...[-2, -2, 5, 2])).toBe(true)
  expect(Geom.isectBbx(...[-4, -4, 4, 4], ...[-2, -2, 2, 5])).toBe(true)
  expect(Geom.isectBbx(...[-4, -4, 4, 4], ...[-6, -6, -6, 6])).toBe(false)
  expect(Geom.isectBbx(...[-4, -4, 4, 4], ...[-6, -6, 6, -6])).toBe(false)
  expect(Geom.isectBbx(...[-4, -4, 4, 4], ...[6, -6, 6, 6])).toBe(false)
  expect(Geom.isectBbx(...[-4, -4, 4, 4], ...[-6, 6, 6, 6])).toBe(false)
  
  expect(Geom.isectBbx(...[-4, -4, 4, 4], ...[-6, -6, -4, -4])).toBe(true)
  expect(Geom.isectBbx(...[-4, -4, 4, 4], ...[-6, -6, -4, 6])).toBe(true)
})

test('.isectBbxWeak', () => {
  expect(Geom.isectBbxWeak(...[-4, -4, 4, 4], ...[-6, -6, -4, -4])).toBe(false)
  expect(Geom.isectBbxWeak(...[-4, -4, 4, 4], ...[-6, -6, -4, 6])).toBe(false)
})

test('.isPointOnLine', () => {
  expect(Geom.isPointOnLine(2, 4, -4, -2, -2, 0)).toBe(true);
  expect(Geom.isPointOnLine(2, 4, -4, -2, -2, 1)).toBe(false);
  expect(Geom.isPointOnLine(2, 4, -4, -2, -2, -1)).toBe(false);
  expect(Geom.isPointOnLine(2, 4, -4, -2, 2, 4)).toBe(true); //#!
})

test('.pointLineOrientation', () => {
  expect(Geom.pointLineOrientation(2, 4, -4, -2, -2, 0)).toBe(0);
  expect(Geom.pointLineOrientation(2, 4, -4, -2, -2, 1)).toBe(-1);
  expect(Geom.pointLineOrientation(2, 4, -4, -2, -2, -1)).toBe(1);
  expect(Geom.pointLineOrientation(2, 4, -4, -2, 2, 4)).toBe(0); //#!
})

test('.isectSegments', () => {
  expect(Geom.isectSegments(-1, -1, 1, 1, -1, 1, 1, -1)).toBe(true)
  expect(Geom.isectSegments(-5, -5, 5, 5, 1, 1, 2, 2)).toBe(true)
  expect(Geom.isectSegments(-5, -5, 5, 5, 1, 1, 2, 3)).toBe(true)
  expect(Geom.isectSegments(-5, -5, 5, 5, 1, 2, 2, 3)).toBe(false)
  expect(Geom.isectSegments(-5, -5, 5, 5, -5, -5, 2, 2)).toBe(true)
  expect(Geom.isectSegments(-5, -5, 5, 5, -5, -5, 2, 3)).toBe(false)
})

test('.isectSegments testCases', () => {
  //https://martin-thoma.com/how-to-check-if-two-line-segments-intersect/#test-cases
  expect(Geom.isectSegments(-4, 0, 4, 0, 0, -4, 0, 4)).toBe(true)
  expect(Geom.isectSegments(-4, -4, 4, 4, 2, 2, 0, 4)).toBe(true)
  expect(Geom.isectSegments(-4, -4, -4, 4, -4, 2, 0, 0)).toBe(true)
  expect(Geom.isectSegments(2, 0, 2, 4, 0, 2, 2, 2)).toBe(true)
  expect(Geom.isectSegments(-4, -4, 4, 4, -4, -4, 4, 4)).toBe(true)
  expect(Geom.isectSegments(-4, -4, 4, 4, -4, -3, 3, 4)).toBe(false)
  expect(Geom.isectSegments(0, 0, 2, 2, 0, 8, 8, 0)).toBe(false)
})

test('.isectSegments local tests', () => {
  expect(Geom.isectSegments(1, -1, 2, -1, 3, -1, 2, -1)).toBe(false)
  expect(Geom.isectSegments(0, -2, 0, 2, 0, -2, 2, -2)).toBe(false)
  expect(Geom.isectSegments(0, -2, 0, 2, 0, -1, 2, -1)).toBe(true)
})


// test.only('.isectSegments', () => {
// expect(Geom.isectSegments(2, 0, 2, 4, 0, 2, 2, 2)).toBe(true)
// })

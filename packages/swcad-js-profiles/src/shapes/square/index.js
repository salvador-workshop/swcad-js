"use strict"

const squareInit = ({ jscad, swcadJs }) => {
  const { square, circle, rectangle, triangle, ellipse } = jscad.primitives
  const { intersect, union, subtract } = jscad.booleans
  const { rotate, align } = jscad.transforms
  const { geom2, path2 } = jscad.geometries

  const { constants } = swcadJs.data
  const { position } = swcadJs.calcs

  const squares = {
    /**
     * Square with circular notches at corners.
     * @memberof profiles.shapes.square
     * @instance
     * @param {Object} opts 
     * @param {number} opts.sqLength - side length for bounding square 
     * @param {number} opts.notchRadius - radius of circular notch
     */
    cornerCircNotch: (opts) => {
      // TODO - fix implementation. Everything assumes that cornerRad === sqLen / 4.
      // So the bounding square probably would be off if it's changed.
      const sqLen = opts.sqLength;
      const halfUnit = sqLen / 2
      const cornerRad = opts.notchRadius || sqLen / 4;
      const centrePoints = [
        [halfUnit, halfUnit],
        [-halfUnit, halfUnit],
        [halfUnit, -halfUnit],
        [-halfUnit, -halfUnit],
      ];

      const baseSquare = square({ size: sqLen });
      const cornerCircles = union(centrePoints.map(cPt => {
        return circle({ radius: cornerRad, center: cPt });
      }));

      return subtract(baseSquare, cornerCircles);
    },
    /**
     * Square with circles at corners.
     * @memberof profiles.shapes.square
     * @instance
     * @param {Object} opts 
     * @param {number} opts.sqLength - side length for bounding square 
     * @param {number} opts.cornerRadius - radius of circular corner
     */
    cornerCircles: (opts) => {
      // TODO - fix implementation. Everything assumes that cornerRad === baseSqLen / 4.
      // So the bounding square probably would be off if it's changed.
      const sqLen = opts.sqLength;

      const baseSqLen = sqLen * 2 / 3;
      const halfUnit = baseSqLen / 2;
      const cornerRad = opts.cornerRadius || baseSqLen / 4;
      const centrePoints = [
        [halfUnit, halfUnit],
        [-halfUnit, halfUnit],
        [halfUnit, -halfUnit],
        [-halfUnit, -halfUnit],
      ];

      const baseSquare = square({ size: baseSqLen });
      const cornerCircles = union(centrePoints.map(cPt => {
        return circle({ radius: cornerRad, center: cPt });
      }));

      return union(baseSquare, cornerCircles);
    }
  }

  return squares
}

module.exports = { init: squareInit }

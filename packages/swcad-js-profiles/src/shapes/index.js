"use strict"

const rectangleModule = require('./rectangle')

/**
 * Builds various 2D profiles
 * @namespace profiles
 */

const profileBuilder = ({ jscad, swcadJs }) => {
  const { square, circle, rectangle, triangle, ellipse } = jscad.primitives
  const { intersect, union, subtract } = jscad.booleans
  const { rotate, align } = jscad.transforms
  const { geom2, path2 } = jscad.geometries

  const { constants } = swcadJs.data
  const { position } = swcadJs.calcs

  const rectangles = rectangleModule.init({ jscad, swcadJs })


  //-------------
  //  TRIANGLES
  //-------------

  const createRtTriangle = ({ base, height, ratio }) => {
    const validOpts = {
      short: base || height / ratio,
      long: height || base * ratio
    }
    const triOpts = position.triangle.rightTriangleOpts({ ...validOpts })
    return triangle(triOpts);
  }

  /**
   * Triangle profiles
   * @memberof profiles.shapes
   * @namespace triangle
   */
  const triangles = {
    /**
     * ...
     * @memberof profiles.shapes.triangle
     * @param {object} opts
     * @returns ...
     */
    equilateral: ({ base }) => {
      return triangle({ type: 'SSS', values: [base, base, base] })
    },
    /**
     * ...
     * @memberof profiles.shapes.triangle
     * @param {object} opts
     * @returns ...
     */
    right45: ({ base }) => {
      const triOpts = position.triangle.rightTriangleOpts({ short: base, long: base })
      return triangle(triOpts);
    },
    /**
     * ...
     * @memberof profiles.shapes.triangle
     * @param {object} opts
     * @returns ...
     */
    right30: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: 2 });
    },
    /**
     * ...
     * @memberof profiles.shapes.triangle
     * @param {object} opts
     * @returns ...
     */
    rightGolden: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: constants.PHI });
    },
    /**
     * ...
     * @memberof profiles.shapes.triangle
     * @param {object} opts
     * @returns ...
     */
    rightSilver: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: constants.SILVER_RATIO });
    },
    /**
     * ...
     * @memberof profiles.shapes.triangle
     * @param {object} opts
     * @returns ...
     */
    rightBronze: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: constants.BRONZE_RATIO });
    },
    /**
     * ...
     * @memberof profiles.shapes.triangle
     * @param {object} opts
     * @returns ...
     */
    rightCopper: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: constants.COPPER_RATIO });
    },
  }


  //-----------
  //  ELLIPSE
  //-----------

  const createEllipse = ({ length, width, ratio }) => {
    const validSize = [
      length || width * ratio,
      width || length / ratio
    ]
    return ellipse({ radius: validSize });
  }

  /**
   * Ellipse profiles
   * @memberof profiles.shapes
   * @namespace ellipse
   */
  const ellipses = {
    /**
     * ...
     * @memberof profiles.shapes.ellipse
     * @param {object} opts
     * @returns ...
     */
    golden: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.PHI })
    },
    /**
     * ...
     * @memberof profiles.shapes.ellipse
     * @param {object} opts
     * @returns ...
     */
    sixtyThirty: ({ length, width }) => {
      return createEllipse({ length, width, ratio: 2 })
    },
    /**
     * ...
     * @memberof profiles.shapes.ellipse
     * @param {object} opts
     * @returns ...
     */
    silver: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.SILVER_RATIO })
    },
    /**
     * ...
     * @memberof profiles.shapes.ellipse
     * @param {object} opts
     * @returns ...
     */
    bronze: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.BRONZE_RATIO })
    },
    /**
     * ...
     * @memberof profiles.shapes.ellipse
     * @param {object} opts
     * @returns ...
     */
    copper: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.COPPER_RATIO })
    },
    /**
     * ...
     * @memberof profiles.shapes.ellipse
     * @param {object} opts
     * @returns ...
     */
    superGolden: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.SUPERGOLDEN_RATIO })
    },
    /**
     * ...
     * @memberof profiles.shapes.ellipse
     * @param {object} opts
     * @returns ...
     */
    plastic: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.PLASTIC_RATIO })
    },
  }

  //----------
  //  OUTPUT
  //----------

  /**
   * Builds various 2D shapes
   * @memberof profiles
   * @namespace shapes
   */
  const shapes = {
    /**
     * Builds various 2D squares
     * @memberof profiles.shapes
     * @namespace square
     */
    square: {
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
    },
    octagon: {
      /**
       * octFromDiam
       * @memberof profiles.shapes
       * @alias octagon
       * @instance
       * @param {Object} opts 
       * @param {number} opts.sqLength - side length for bounding square 
       */
      octFromDiam: (opts) => {
        const sqLen = opts.sqLength;
        // const octagonSideLen = Math.tan(Math.PI / 8) * (sqLen / 2) * 2;

        const baseSquare = square({ size: sqLen });
        const angledSquare = rotate([0, 0, Math.PI / 4], baseSquare);

        return intersect(baseSquare, angledSquare);
      }
    },
    triangle: triangles,
    rectangle: rectangles,
    ellipse: ellipses,
  }

  return shapes
}

module.exports = { init: profileBuilder }

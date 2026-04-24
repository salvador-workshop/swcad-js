"use strict"

const triangleInit = ({ jscad, swcadJs }) => {
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

  return triangles
}

module.exports = { init: triangleInit }

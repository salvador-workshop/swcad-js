"use strict"

const ellipseInit = ({ jscad, swcadJs }) => {
  const { square, circle, rectangle, triangle, ellipse } = jscad.primitives
  const { intersect, union, subtract } = jscad.booleans
  const { rotate, align } = jscad.transforms
  const { geom2, path2 } = jscad.geometries

  const { constants } = swcadJs.data
  const { position } = swcadJs.calcs

  //-----------
  //  ELLIPSE
  //-----------

  const createEllipse = ({ width, depth, ratio }) => {
    const validSize = [
      width || depth / ratio,
      depth || width * ratio,
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
    golden: ({ width, depth }) => {
      return createEllipse({ width, depth, ratio: constants.PHI })
    },
    /**
     * ...
     * @memberof profiles.shapes.ellipse
     * @param {object} opts
     * @returns ...
     */
    sixtyThirty: ({ width, depth }) => {
      return createEllipse({ width, depth, ratio: 2 })
    },
    /**
     * ...
     * @memberof profiles.shapes.ellipse
     * @param {object} opts
     * @returns ...
     */
    silver: ({ width, depth }) => {
      return createEllipse({ width, depth, ratio: constants.SILVER_RATIO })
    },
    /**
     * ...
     * @memberof profiles.shapes.ellipse
     * @param {object} opts
     * @returns ...
     */
    bronze: ({ width, depth }) => {
      return createEllipse({ width, depth, ratio: constants.BRONZE_RATIO })
    },
    /**
     * ...
     * @memberof profiles.shapes.ellipse
     * @param {object} opts
     * @returns ...
     */
    copper: ({ width, depth }) => {
      return createEllipse({ width, depth, ratio: constants.COPPER_RATIO })
    },
    /**
     * ...
     * @memberof profiles.shapes.ellipse
     * @param {object} opts
     * @returns ...
     */
    superGolden: ({ width, depth }) => {
      return createEllipse({ width, depth, ratio: constants.SUPERGOLDEN_RATIO })
    },
    /**
     * ...
     * @memberof profiles.shapes.ellipse
     * @param {object} opts
     * @returns ...
     */
    plastic: ({ width, depth }) => {
      return createEllipse({ width, depth, ratio: constants.PLASTIC_RATIO })
    },
  }

  return ellipses
}

module.exports = { init: ellipseInit }

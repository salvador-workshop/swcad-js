"use strict"

const ellipseModule = require('./ellipsee')
const rectangleModule = require('./rectangle')
const squareModule = require('./square')
const triangleModule = require('./triangle')

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

  const ellipses = ellipseModule.init({ jscad, swcadJs })
  const rectangles = rectangleModule.init({ jscad, swcadJs })
  const squares = squareModule.init({ jscad, swcadJs })
  const triangles = triangleModule.init({ jscad, swcadJs })

  //----------
  //  OUTPUT
  //----------

  /**
   * Builds various 2D shapes
   * @memberof profiles
   * @namespace shapes
   */
  const shapes = {
    ellipse: ellipses,
    rectangle: rectangles,
    square: squares,
    triangle: triangles,
  }

  return shapes
}

module.exports = { init: profileBuilder }

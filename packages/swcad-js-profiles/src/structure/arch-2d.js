"use strict"

/**
 * Builds circle-based arches.
 * @memberof profiles
 * @namespace arch
 */

const archBuilder = ({ jscad, swcadJs }) => {
  const { path2, geom2 } = jscad.geometries
  const { extrudeRotate } = jscad.extrusions
  const { arc, cuboid } = jscad.primitives
  const { translate, mirror, rotate, align } = jscad.transforms
  const { union, subtract, intersect } = jscad.booleans
  const { measureDimensions } = jscad.measurements;

  return {
    /**
     * Builds a one-centre (semicircular) arch.
     * @memberof profiles.arch
     * @instance
     * @param {Object} opts 
     * @param {number} opts.arcRadius - arc radius 
     */
    onePtArch: (opts) => {
      const arcRad = opts.arcRadius;
      const baseArchPath = path2.close(arc({ radius: arcRad, endAngle: Math.PI, segments: 48 }));
      return geom2.fromPoints(path2.toPoints(baseArchPath));
    },
    /**
     * Builds a two-centre pointed arch.
     * @memberof profiles.arch
     * @instance
     * @param {Object} opts 
     * @param {number} opts.arcRadius - arc radius 
     * @param {number} opts.archWidth - arch width 
     */
    twoPtArch: (opts) => {
      const arcRad = opts.arcRadius;
      const archWth = opts.archWidth;
      // 2D
      const baseArchPath = path2.close(arc({ radius: arcRad, endAngle: Math.PI, segments: 48 }));
      const baseArch = geom2.fromPoints(path2.toPoints(baseArchPath));
      const mirrorAxis = arcRad - (archWth / 2);
      const reflectedArch = mirror({ normal: [1, 0, 0], origin: [mirrorAxis, 0, 0] }, baseArch);
      return align({ modes: ['center', 'min', 'min'] }, intersect(baseArch, reflectedArch));

    },
    threePt: (opts) => {
      return null;
    },
    fourPt: (opts) => {
      return null;
    },
  }
}

module.exports = { init: archBuilder }

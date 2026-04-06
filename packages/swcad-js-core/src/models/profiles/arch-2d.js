"use strict"

/**
 * Builds circle-based arches.
 * @memberof profiles
 * @namespace arch
 */

const archBuilder = ({ lib }) => {
  const { path2, geom2 } = lib.geometries
  const { extrudeRotate } = lib.extrusions
  const { arc, cuboid } = lib.primitives
  const { translate, mirror, rotate, align } = lib.transforms
  const { union, subtract, intersect } = lib.booleans
  const { measureDimensions } = lib.measurements;

  return {
    /**
     * Builds a one-centre (semicircular) arch.
     * @memberof models.arch
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
     * @memberof models.arch
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

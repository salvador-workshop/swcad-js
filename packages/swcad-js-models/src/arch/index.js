"use strict"

/**
 * Builds circle-based arches. Input 2D profiles must be centred at (0, 0, 0)
 * @memberof models
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
     * @memberof models.arch
     * @instance
     * @param {Object} opts 
     * @param {number} opts.arcRadius - arc radius 
     * @param {geom2.Geom2} geomProfile - 2D cross-section profile
     */
    onePtArch: (opts, geomProfile) => {
      const arcRad = opts.arcRadius;
      const profile = translate([arcRad, 0, 0], geomProfile);
      const baseArch = extrudeRotate({ segments: 48, angle: Math.PI }, profile);

      return align({ modes: ['center', 'center', 'min'] }, rotate([Math.PI / 2, 0, 0], baseArch));

    },
    /**
     * Builds a two-centre pointed arch.
     * @memberof models.arch
     * @instance
     * @param {Object} opts 
     * @param {number} opts.arcRadius - arc radius 
     * @param {number} opts.archWidth - arch width 
     * @param {geom2.Geom2} geomProfile - 2D cross-section profile
     */
    twoPtArch: (opts, geomProfile) => {
      const arcRad = opts.arcRadius;
      const archWth = opts.archWidth;
      const profileSpecs = measureDimensions(geomProfile);
      const profile = translate([profileSpecs[0] / 2 + arcRad, 0, 0], geomProfile);
      const baseArch = extrudeRotate({ segments: 48, angle: Math.PI }, profile);

      const cutawaySize = Math.max(archWth, arcRad) * 2;
      const mirrorAxis = arcRad - (archWth / 2);
      const cutawayOffset = (cutawaySize / -2) + mirrorAxis;
      const archCutaway = translate([cutawayOffset, cutawaySize / 2, 0], cuboid(
        {
          size: [cutawaySize, cutawaySize, profileSpecs[1] * 1.25],
          center: [0, 0, 0]
        }
      ))
      const cutArch = subtract(baseArch, archCutaway);
      const reflectedArch = mirror({ normal: [1, 0, 0], origin: [mirrorAxis, 0, 0] }, cutArch);

      return align({ modes: ['center', 'center', 'min'] }, rotate([Math.PI / 2, 0, 0], union(cutArch, reflectedArch)));

    },
    threePt: (opts, geomProfile) => {
      return null;
    },
    fourPt: (opts, geomProfile) => {
      return null;
    },
  }
}

module.exports = { init: archBuilder }

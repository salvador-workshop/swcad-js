"use strict"

/**
 * Builds circle-based arches. Input 2D profiles must be centred at (0, 0, 0)
 * @namespace builders.arches
 */

const archBuilder = ({ lib, swLib }) => {
  const { path2, geom2 } = lib.geometries
  const { extrudeRotate } = lib.extrusions
  const { arc, cuboid } = lib.primitives
  const { translate, mirror, rotate, align } = lib.transforms
  const { union, subtract, intersect } = lib.booleans
  const { measureDimensions } = lib.measurements;

  return {
    /**
     * Builds a one-centre (semicircular) arch.
     * @memberof builders.arches
     * @instance
     * @param {Object} opts 
     * @param {number} opts.arcRadius - arc radius 
     * @param {geom2.Geom2} geomProfile - 2D cross-section profile
     */
    onePtArch: (opts, geomProfile) => {
      const arcRad = opts.arcRadius;

      if (geomProfile) {
        // 3D
        const profile = translate([arcRad, 0, 0], geomProfile);
        const baseArch = extrudeRotate({ segments: 48, angle: Math.PI }, profile);

        return align({ modes: ['center', 'center', 'min'] }, rotate([Math.PI / 2, 0, 0], baseArch));
      } else {
        // 2D
        const baseArchPath = path2.close(arc({ radius: arcRad, endAngle: Math.PI, segments: 48 }));
        return geom2.fromPoints(path2.toPoints(baseArchPath));
      }
    },
    /**
     * Builds a two-centre pointed arch.
     * @memberof builders.arches
     * @instance
     * @param {Object} opts 
     * @param {number} opts.arcRadius - arc radius 
     * @param {number} opts.archWidth - arch width 
     * @param {geom2.Geom2} geomProfile - 2D cross-section profile
     */
    twoPtArch: (opts, geomProfile) => {
      const arcRad = opts.arcRadius;
      const archWth = opts.archWidth;

      if (geomProfile) {
        // 3D
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
      } else {
        // 2D
        const baseArchPath = path2.close(arc({ radius: arcRad, endAngle: Math.PI, segments: 48 }));
        const baseArch = geom2.fromPoints(path2.toPoints(baseArchPath));
        const mirrorAxis = arcRad - (archWth / 2);
        const reflectedArch = mirror({ normal: [1, 0, 0], origin: [mirrorAxis, 0, 0] }, baseArch);
        return align({ modes: ['center', 'min', 'min'] }, intersect(baseArch, reflectedArch));
      }
    },
    threePt: (opts, geomProfile) => {
      if (geomProfile) {
        // 3D
        return null;
      } else {
        // 2D
        return null;
      }
    },
    fourPt: (opts, geomProfile) => {
      if (geomProfile) {
        // 3D
        return null;
      } else {
        // 2D
        return null;
      }
    },
  }
}

module.exports = { init: archBuilder }

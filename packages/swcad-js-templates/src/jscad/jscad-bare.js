"use strict"

const jscad = require('@jscad/modeling')

const {
    cube,
    cylinder,
    sphere,
    cylinderElliptic,
    circle,
    cuboid,
    roundedCuboid,
    roundedCylinder,
    roundedRectangle,
    rectangle,
    triangle,
} = jscad.primitives

const {
    align,
    translate,
    rotate,
    mirror
} = jscad.transforms

const {
    intersect,
    subtract,
    union,
    scission
} = jscad.booleans

const {
    extrudeLinear,
    extrudeRotate,
    project
} = jscad.extrusions

const {
    measureDimensions,
    measureBoundingBox,
    measureVolume
} = jscad.measurements

const {
    hull,
    hullChain
} = jscad.hulls

const { vectorText } = jscad.text
const { toOutlines } = jscad.geometries.geom2
const { TAU } = jscad.maths.constants
const { colorize } = jscad.colors

const inchesToMm = (numIn) => numIn * 25.4


//==============================================================================


/* ----------------------------------------
 * Test subjects
 * ------------------------------------- */

const newModelOpts = {
    size: [inchesToMm(3), inchesToMm(3), inchesToMm(1)],
}
const newModel = cuboid(newModelOpts)



//==============================================================================




/**
 * Main function to be rendered by JSCAD
 * @returns `geom3` or `geom3[]`
 * @ignore
 */
function main() {
    const spaceUnit = inchesToMm(3.5)

    return [
        translate([spaceUnit * 0, spaceUnit * 0, spaceUnit * 0], newModel),
    ]
}


module.exports = {
    main,
}

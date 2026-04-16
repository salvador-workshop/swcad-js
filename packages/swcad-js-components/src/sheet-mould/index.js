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

const swcadJs = require('swcad-js').init({ jscad });

const {
    math,
} = swcadJs.calcs

const sheetMould = require('./sheet-mould').init({ jscad, swcadJs })


//==============================================================================


/* ----------------------------------------
 * Model / Scene Prep
 * ------------------------------------- */


const outer = subtract(
    cube({ size: 10 }),
    sphere({ radius: 6.8 })
)

const inner = intersect(
    sphere({ radius: 4 }),
    cube({ size: 7 })
)

const sheetMouldOpts = {}
const sheetMouldData = sheetMould(sheetMouldOpts)
const sheetMouldModel = sheetMouldData[0]
const sheetMouldParts = sheetMouldData[1]

//==============================================================================


/**
 * Main function to be rendered by JSCAD
 * @returns `geom3` or `geom3[]`
 */
function main() {
    const spaceUnit = math.inchesToMm(2)

    return [
        translate([spaceUnit * 0, spaceUnit * 0, spaceUnit * 0], sheetMouldModel),

        translate([spaceUnit * 1, spaceUnit * 0, spaceUnit * 0], sheetMouldParts.mouldPoint),
        translate([spaceUnit * 1, spaceUnit * 1, spaceUnit * 0], sheetMouldParts.mouldPointSupport),
        translate([spaceUnit * 1, spaceUnit * 2, spaceUnit * 0], sheetMouldParts.dotMoulds),
        translate([spaceUnit * 1, spaceUnit * 3, spaceUnit * 0], sheetMouldParts.lineMoulds),
    ]
}


module.exports = {
    main,
}

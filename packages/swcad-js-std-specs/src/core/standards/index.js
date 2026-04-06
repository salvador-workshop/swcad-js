"use strict"

const craftStd = require('./std-crafts')
const lumberStd = require('./std-lumber')
const masonryStd = require('./std-masonry')
const paperStd = require('./std-paper')
const tileStd = require('./std-tiles')

/**
 * ...
 * @memberof data
 * @namespace standards
 */

const standards = ({ lib, swLib }) => {
    const { constants, maths } = swLib.core

    const pegboard = {
        PEGBOARD_SPACING: maths.inchesToMm(1),
        PEGBOARD_HOLE_DIAM: maths.inchesToMm(7 / 32),
        MICRO_PEGBOARD_SPACING: maths.inchesToMm(1 / 2),
        MICRO_PEGBOARD_HOLE_DIAM: maths.inchesToMm(1 / 8),
    }

    const gridfinity = {
        GRIDFINITY_SPACING: 42,
        GRIDFINITY_RAIL_WIDTH: 7,
    }

    const swDefaults = {
        PANEL_THICKNESS_XS: maths.inchesToMm(2 / 64),  // 1/32"
        PANEL_THICKNESS_SM: maths.inchesToMm(3 / 64),
        PANEL_THICKNESS_MD: maths.inchesToMm(4 / 64),   // 1/16"
        PANEL_THICKNESS_LG: maths.inchesToMm(5 / 64),
        PANEL_THICKNESS_XL: maths.inchesToMm(6 / 64),   // 3/32"
    }

    return {
        pegboard,
        gridfinity,
        swDefaults,
        crafts: craftStd.init({ lib, swLib }),
        lumber: lumberStd.init({ lib, swLib }),
        masonry: masonryStd.init({ lib, swLib }),
        paper: paperStd.init({ lib, swLib }),
        tiles: tileStd.init({ lib, swLib }),
    }
}

module.exports = { init: standards };

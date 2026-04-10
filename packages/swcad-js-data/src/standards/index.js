"use strict"

const craftStd = require('./std-crafts')
const lumberStd = require('./std-lumber')
const masonryStd = require('./std-masonry')
const paperStd = require('./std-paper')
const tileStd = require('./std-tiles')

const inchesToMm = (numIn) => numIn * 25.4

/**
 * ...
 * @memberof data
 * @namespace standards
 */

const standards = ({ jscad }) => {

    /**
     * Pegboard standards
     * @memberof data.standards
     */
    const pegboard = {
        PEGBOARD_SPACING: inchesToMm(1),
        PEGBOARD_HOLE_DIAM: inchesToMm(7 / 32),
        MICRO_PEGBOARD_SPACING: inchesToMm(1 / 2),
        MICRO_PEGBOARD_HOLE_DIAM: inchesToMm(1 / 8),
    }

    /**
     * Gridfinity standards
     * @memberof data.standards
     */
    const gridfinity = {
        GRIDFINITY_SPACING: 42,
        GRIDFINITY_RAIL_WIDTH: 7,
    }

    /**
     * SW Panel Thicknesses
     * @memberof data.standards
     */
    const swDefaults = {
        PANEL_THICKNESS_XS: inchesToMm(2 / 64),  // 1/32"
        PANEL_THICKNESS_SM: inchesToMm(3 / 64),
        PANEL_THICKNESS_MD: inchesToMm(4 / 64),   // 1/16"
        PANEL_THICKNESS_LG: inchesToMm(5 / 64),
        PANEL_THICKNESS_XL: inchesToMm(6 / 64),   // 3/32"
    }

    return {
        pegboard,
        gridfinity,
        swDefaults,
        crafts: craftStd.init({ jscad }),
        lumber: lumberStd.init({ jscad }),
        masonry: masonryStd.init({ jscad }),
        paper: paperStd.init({ jscad }),
        tiles: tileStd.init({ jscad }),
    }
}

module.exports = { init: standards };

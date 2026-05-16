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
     * Type standards
     * @memberof data.standards
     */
    const types = {
        TYPE_DEFAULT: { id: 'default', desc: 'Default' },
        TYPE_ALT: { id: 'alt', desc: 'Alternate' },
    }

    const interfaceThickness = 1.333333
    const fitGap = inchesToMm(1 / 128)

    const panelThicknessXs = interfaceThickness * 0.5
    const panelThicknessSm = interfaceThickness * 0.75
    const panelThicknessMd = interfaceThickness
    const panelThicknessLg = interfaceThickness * 1.25
    const panelThicknessXl = interfaceThickness * 1.5

    const smProfileBeadWidth = interfaceThickness * 1.125
    const mdProfileBeadWidth = interfaceThickness * 1.5
    const lgProfileBeadWidth = interfaceThickness * 1.75

    const swDefaults = {
        /**
         * Interface thickness
         * @memberof data.standards
         */
        INTERFACE_THICKNESS: interfaceThickness,
        /**
         * Fit_Gap
         * @memberof data.standards
         */
        FIT_GAP: fitGap,
        /**
         * Panel_Thickness_Xs
         * @memberof data.standards
         */
        PANEL_THICKNESS_XS: panelThicknessXs,
        /**
         * Panel_Thickness_Sm
         * @memberof data.standards
         */
        PANEL_THICKNESS_SM: panelThicknessSm,
        /**
         * Panel_Thickness_Md
         * @memberof data.standards
         */
        PANEL_THICKNESS_MD: panelThicknessMd,
        /**
         * Panel_Thickness_Lg
         * @memberof data.standards
         */
        PANEL_THICKNESS_LG: panelThicknessLg,
        /**
         * Panel_Thickness_Xl
         * @memberof data.standards
         */
        PANEL_THICKNESS_XL: panelThicknessXl,
        /**
         * Sm_Profile_Bead_Width
         * @memberof data.standards
         */
        SM_PROFILE_BEAD_WIDTH: smProfileBeadWidth,
        /**
         * Md_Profile_Bead_Width
         * @memberof data.standards
         */
        MD_PROFILE_BEAD_WIDTH: mdProfileBeadWidth,
        /**
         * Lg_Profile_Bead_Width
         * @memberof data.standards
         */
        LG_PROFILE_BEAD_WIDTH: lgProfileBeadWidth,
    }

    /**
     * Param standards
     * @memberof data.standards
     */
    const params = {
        OBJ_2D_SIZE: [
            math.inchesToMm(2),
            math.inchesToMm(4),
        ],
        OBJ_3D_SIZE: [
            math.inchesToMm(2),
            math.inchesToMm(4),
            math.inchesToMm(1),
        ],
    }

    return {
        ...swDefaults,
        pegboard,
        gridfinity,
        types,
        params,
        crafts: craftStd.init({ jscad }),
        lumber: lumberStd.init({ jscad }),
        masonry: masonryStd.init({ jscad }),
        paper: paperStd.init({ jscad }),
        tiles: tileStd.init({ jscad }),
    }
}

module.exports = { init: standards };

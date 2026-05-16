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
     * @namespace pegboard
     * @memberof data.standards
     */
    const pegboard = {
        /**
         * Pegboard_Spacing
         * @memberof data.standards.pegboard
         */
        PEGBOARD_SPACING: inchesToMm(1),
        /**
         * Pegboard_Hole_Diam
         * @memberof data.standards.pegboard
         */
        PEGBOARD_HOLE_DIAM: inchesToMm(7 / 32),
        /**
         * Micro_Pegboard_Spacing
         * @memberof data.standards.pegboard
         */
        MICRO_PEGBOARD_SPACING: inchesToMm(1 / 2),
        /**
         * Micro_Pegboard_Hole_Diam
         * @memberof data.standards.pegboard
         */
        MICRO_PEGBOARD_HOLE_DIAM: inchesToMm(1 / 8),
    }

    /**
     * Gridfinity standards
     * @namespace gridfinity
     * @memberof data.standards
     */
    const gridfinity = {
        /**
         * Gridfinity_Spacing
         * @memberof data.standards.gridfinity
         */
        GRIDFINITY_SPACING: 42,
        /**
         * Gridfinity_Rail_Width
         * @memberof data.standards.gridfinity
         */
        GRIDFINITY_RAIL_WIDTH: 7,
    }

    /**
     * Type standards
     * @namespace types
     * @memberof data.standards
     */
    const types = {
        /**
         * Type_Default
         * @memberof data.standards.types
         */
        TYPE_DEFAULT: { id: 'default', desc: 'Default' },
        /**
         * Type_Alt
         * @memberof data.standards.types
         */
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

    const smReinforcementWidth = 3
    const mdReinforcementWidth = 4
    const lgReinforcementWidth = 5

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
        /**
         * Sm_Reinforcement_Width
         * @memberof data.standards
         */
        SM_REINFORCEMENT_WIDTH: smReinforcementWidth,
        /**
         * Md_Reinforcement_Width
         * @memberof data.standards
         */
        MD_REINFORCEMENT_WIDTH: mdReinforcementWidth,
        /**
         * Lg_Reinforcement_Width
         * @memberof data.standards
         */
        LG_REINFORCEMENT_WIDTH: lgReinforcementWidth,
    }

    /**
     * Param standards
     * @namespace params
     * @memberof data.standards
     */
    const params = {
        /**
         * Obj_2d_Size
         * @memberof data.standards.params
         */
        OBJ_2D_SIZE: [
            inchesToMm(2),
            inchesToMm(4),
        ],
        /**
         * Obj_3d_Size
         * @memberof data.standards.params
         */
        OBJ_3D_SIZE: [
            inchesToMm(2),
            inchesToMm(4),
            inchesToMm(1),
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

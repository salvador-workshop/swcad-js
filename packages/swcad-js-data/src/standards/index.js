"use strict"

const inchesToMm = (numIn) => numIn * 25.4

/**
 * Dimensions and options used throughout the SWCAD-JS system.
 * @memberof data
 * @namespace standards
 */

const standards = ({ jscad }) => {
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

    const xsReinforcementWidth = 2
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
         * Xs_Reinforcement_Width
         * @memberof data.standards
         */
        XS_REINFORCEMENT_WIDTH: xsReinforcementWidth,
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

    return swDefaults
}

module.exports = { init: standards };

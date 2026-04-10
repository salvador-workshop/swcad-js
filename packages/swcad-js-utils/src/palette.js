"use strict"

/**
 * ...
 * @memberof utils
 * @namespace palette
 */

// Original color palette by
// https://www.google.com/design/spec/style/color.html

const paletteUtils = ({ jscad, swcadJs }) => {
    const { colors } = swcadJs.utils

    const palette = {
        /** @memberof utils.palette */
        light: {
            default: colors.blue,
            primary: colors.indigo,
            secondary: colors.green,
            tertiary: colors.pink,
            layout: colors.translucentDeepOrange,
            detail: colors.lightBlue,
            guide: colors.translucentGrey,
        },
        /** @memberof utils.palette */
        dark: {
            default: colors.blue,
            primary: colors.indigo,
            secondary: colors.green,
            tertiary: colors.pink,
            layout: colors.translucentDeepOrange,
            detail: colors.lightBlue,
            guide: colors.translucentGrey,
        },
    }

    return palette;
}
module.exports = { init: paletteUtils }

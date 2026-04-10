"use strict"

/**
 * ...
 * @memberof utils
 * @namespace palette
 */

// Original color palette by
// https://www.google.com/design/spec/style/color.html

const paletteUtils = ({ lib }) => {
    const colours = require('./colors').init({ lib })

    const palette = {
        /** @memberof utils.palette */
        light: {
            default: colours.blue,
            primary: colours.indigo,
            secondary: colours.green,
            tertiary: colours.pink,
            layout: colours.translucentDeepOrange,
            detail: colours.lightBlue,
            guide: colours.translucentGrey,
        },
        /** @memberof utils.palette */
        dark: {
            default: colours.blue,
            primary: colours.indigo,
            secondary: colours.green,
            tertiary: colours.pink,
            layout: colours.translucentDeepOrange,
            detail: colours.lightBlue,
            guide: colours.translucentGrey,
        },
    }

    return palette;
}
module.exports = { init: paletteUtils }

"use strict"

/**
 * ...
 * @memberof utils
 * @namespace colors
 */

// Original color palette by
// https://www.google.com/design/spec/style/color.html

const colourUtils = ({ lib }) => {
    const { hexToRgb } = lib.colors;

    const colors = {
        /** @memberof utils.colors */
        red: hexToRgb('#f44336'),
        /** @memberof utils.colors */
        pink: hexToRgb('#e91e63'),
        /** @memberof utils.colors */
        purple: hexToRgb('#9c27b0'),
        /** @memberof utils.colors */
        deepPurple: hexToRgb('#673ab7'),
        /** @memberof utils.colors */
        indigo: hexToRgb('#3f51b5'),
        /** @memberof utils.colors */
        blue: hexToRgb('#2196f3'),
        /** @memberof utils.colors */
        lightBlue: hexToRgb('#03a9f4'),
        /** @memberof utils.colors */
        cyan: hexToRgb('#00bcd4'),
        /** @memberof utils.colors */
        teal: hexToRgb('#009688'),
        /** @memberof utils.colors */
        green: hexToRgb('#4caf50'),
        /** @memberof utils.colors */
        lightGreen: hexToRgb('#8bc34a'),
        /** @memberof utils.colors */
        lime: hexToRgb('#cddc39'),
        /** @memberof utils.colors */
        yellow: hexToRgb('#ffeb3b'),
        /** @memberof utils.colors */
        amber: hexToRgb('#ffc107'),
        /** @memberof utils.colors */
        orange: hexToRgb('#ff9800'),
        /** @memberof utils.colors */
        deepOrange: hexToRgb('#ff5722'),
        /** @memberof utils.colors */
        brown: hexToRgb('#795548'),
        /** @memberof utils.colors */
        grey: hexToRgb('#9e9e9e'),
        /** @memberof utils.colors */
        blueGrey: hexToRgb('#607d8b'),
        /** @memberof utils.colors */
        white: hexToRgb('#ffffff'),
    }

    // Adding translucent colours
    for (const [colour, rgbVal] of Object.entries(colors)) {
        const capColName = colour.slice(0, 1).toUpperCase() + colour.slice(1);
        colors[`translucent${capColName}1`] = [...rgbVal, 0.3];
        colors[`translucent${capColName}2`] = [...rgbVal, 0.5];
        // using 2nd one as default value
        colors[`translucent${capColName}`] = [...rgbVal, 0.5];
        colors[`translucent${capColName}3`] = [...rgbVal, 0.7];
    }

    return colors;
}
module.exports = { init: colourUtils }

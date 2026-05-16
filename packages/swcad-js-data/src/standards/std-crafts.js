"use strict"

/**
 * Craft standards
 * @namespace crafts
 * @memberof data.standards
 */
const craftStd = ({ jscad }) => {
    return {
        /**
         * Diam_Toothpick
         * @memberof data.standards.crafts
         * @constant {number}
         */
        DIAM_TOOTHPICK: 2.30,
        /**
         * Diam_Bbq_Skewer
         * @memberof data.standards.crafts
         * @constant {number}
         */
        DIAM_BBQ_SKEWER: 3.25,
        /**
         * Popsicle_Stick_Width
         * @memberof data.standards.crafts
         * @constant {number}
         */
        POPSICLE_STICK_WIDTH: 10,
        /**
         * Popsicle_Stick_Thickness
         * @memberof data.standards.crafts
         * @constant {number}
         */
        POPSICLE_STICK_THICKNESS: 2,
        /**
         * Popsicle_Stick_Length
         * @memberof data.standards.crafts
         * @constant {number}
         */
        POPSICLE_STICK_LENGTH: 114,
    }
}

module.exports = { init: craftStd };

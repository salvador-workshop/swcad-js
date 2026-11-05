"use strict"

const tri30Factor = Math.sqrt(3)
const tri45Factor = Math.sqrt(2)
const eqTriHeightFactor = tri30Factor / 2

/**
 * System constants
 * @namespace constants
 * @memberof data
 */

const constants = {
    /**
     * Inches / Millimetre conversion rate
     * @memberof data.constants
     * @constant {number}
     */
    INCHES_MM_FACTOR: 25.4,
    /**
     * Ratio of equilateral triangle's height to its side length
     * @memberof data.constants
     * @constant {number}
     */
    EQUI_TRIANGLE_HEIGHT_FACTOR: eqTriHeightFactor,
    /**
     * Tri_45_Factor
     * @memberof data.constants
     * @constant {number}
     */
    TRI_45_FACTOR: tri45Factor,
    /**
     * Tri_30_Factor
     * @memberof data.constants
     * @constant {number}
     */
    TRI_30_FACTOR: tri30Factor,
}

module.exports = constants;

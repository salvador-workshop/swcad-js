"use strict"

const tri30Factor = Math.sqrt(3)
const tri45Factor = Math.sqrt(2)
const eqTriHeightFactor = tri30Factor / 2

const phi = 1.6180339887

/**
 * ...
 * @memberof utils
 * @namespace constants
 */

const constants = {
    /**
     * Inches / Millimetre conversion rate
     * @memberof utils.constants
     * @constant {number}
     */
    INCHES_MM_FACTOR: 25.4,
    /**
     * Golden ratio
     * @memberof utils.constants
     * @constant {number}
     */
    PHI: phi,
    /**
     * Golden ratio inverse
     * @memberof utils.constants
     * @constant {number}
     */
    PHI_INV: 1 / phi,
    /**
     * Ratio of equilateral triangle's height to its side length
     * @memberof utils.constants
     * @constant {number}
     */
    EQUI_TRIANGLE_HEIGHT_FACTOR: eqTriHeightFactor,
    /**
     * ...
     * @memberof utils.constants
     * @constant {number}
     */
    TRI_45_FACTOR: tri45Factor,
    /**
     * ...
     * @memberof utils.constants
     * @constant {number}
     */
    TRI_30_FACTOR: tri30Factor,
}

module.exports = constants;

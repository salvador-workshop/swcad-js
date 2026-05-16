"use strict"

const tri30Factor = Math.sqrt(3)
const tri45Factor = Math.sqrt(2)
const eqTriHeightFactor = tri30Factor / 2

const phi = 1.6180339887

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
     * Golden ratio
     * @memberof data.constants
     * @constant {number}
     */
    PHI: phi,
    /**
     * Golden ratio inverse
     * @memberof data.constants
     * @constant {number}
     */
    PHI_INV: 1 / phi,
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
    /**
     * Plastic_Ratio
     * @memberof data.constants
     * @constant {number}
     */
    PLASTIC_RATIO: 1.3247179572,
    /**
     * Supergolden_Ratio
     * @memberof data.constants
     * @constant {number}
     */
    SUPERGOLDEN_RATIO: 1.4655712319,
    /**
     * Golden_Ratio
     * @memberof data.constants
     * @constant {number}
     */
    GOLDEN_RATIO: phi,
    /**
     * Silver_Ratio
     * @memberof data.constants
     * @constant {number}
     */
    SILVER_RATIO: 1 + tri45Factor,         // 2.4142
    /**
     * Bronze_Ratio
     * @memberof data.constants
     * @constant {number}
     */
    BRONZE_RATIO: 3 + Math.sqrt(13) / 2,     // 3.3028
    /**
     * Copper_Ratio
     * @memberof data.constants
     * @constant {number}
     */
    COPPER_RATIO: 2 + Math.sqrt(5),     // 4.2361
    /**
     * Nickel_Ratio
     * @memberof data.constants
     * @constant {number}
     */
    NICKEL_RATIO: 5 + Math.sqrt(29),     // 5.1925
}

module.exports = constants;

"use strict"

/**
 * Various math functions
 * @memberof calcs
 * @namespace math
 */

/**
 * Collection of all possible ordered pairs (a, b) such that the first element a belongs to set A and the second element b belongs to set B.
 * @memberof calcs.math
 * @param {number[]} a - first set
 * @param {number[]} b - second set
 * @returns {number[][]} Set of coordinates, pairing all members of the first set and the second set
 */
const arrayCartesianProduct = (a, b) => a.reduce((acc, x) => [...acc, ...b.map(y => [x, y])], []);

const mathUtils = ({ jscad, swcadJs }) => {
    const {
        INCHES_MM_FACTOR
    } = swcadJs.data.constants;

    return {
        /**
         * Checks if a given integer is even
         * @param {number} n - an integer
         * @returns {boolean} true if even, false if not
         * @memberof calcs.math
         */
        isEven: (n) => {
            return n % 2 == 0;
        },
        /**
         * Checks if a given integer is odd
         * @memberof calcs.math
         * @param {number} n - an integer
         * @returns {boolean} true if odd, false if not
         */
        isOdd: (n) => {
            return Math.abs(n % 2) == 1;
        },
        /**
         * Converts distance in inches to mm
         * @memberof calcs.math
         * @param {number} numInches - distance in inches
         * @returns {number} distance in mm
         */
        inchesToMm: (numInches) => numInches * INCHES_MM_FACTOR,
        /**
         * Converts distance in mm to inches
         * @memberof calcs.math
         * @param {number} numMils - distance in mm
         * @returns {number} distance in inches
         */
        mmToInches: (numMils) => numMils / INCHES_MM_FACTOR,
        /**
         * Given an integer, calculates two integers that are factors for a containing rectangle around the input.
         * @memberof calcs.math
         * @param {number} num 
         * @returns {number[]} two integers that are factors for a containing rectangle around the input
         */
        factorize: (num) => {
            const int1 = Math.floor(Math.sqrt(num));
            const rem = num % int1
            if (rem === 0) {
                return [int1, int1]
            }
            const int2 = (num - rem) / int1
            return [int1, int2 + 1]
        },
        /**
         * Gets a random integer between `min` and `max`. The maximum is exclusive and the minimum is inclusive
         * @param {number} min
         * @param {number} max
         * @returns {number} random integer
         * @memberof calcs.math
         */
        getRandomInt: (min, max) => {
            const minCeiled = Math.ceil(min);
            const maxFloored = Math.floor(max);
            return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
        },
        arrayCartesianProduct,
    }
}


module.exports = { init: mathUtils };

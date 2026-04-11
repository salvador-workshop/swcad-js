"use strict"

/**
 * ...
 * @memberof calcs
 * @namespace math
 */

/**
 * @memberof calcs.math
 * @param {*} a 
 * @param {*} b 
 * @returns ...
 */
const arrayCartesianProduct = (a, b) => a.reduce((acc, x) => [...acc, ...b.map(y => [x, y])], []);

const mathUtils = ({ jscad, swcadJs }) => {
    const {
        INCHES_MM_FACTOR
    } = swcadJs.data.constants;

    return {
        /**
         * ...
         * @param {*} n 
         * @returns ...
         * @memberof calcs.math
         */
        isEven: (n) => {
            return n % 2 == 0;
        },
        /**
         * ...
         * @memberof calcs.math
         * @param {*} n 
         * @returns ...
         */
        isOdd: (n) => {
            return Math.abs(n % 2) == 1;
        },
        arrayCartesianProduct,
        /**
         * ...
         * @memberof calcs.math
         * @param {*} numInches 
         * @returns ...
         */
        inchesToMm: (numInches) => numInches * INCHES_MM_FACTOR,
        /**
         * ...
         * @memberof calcs.math
         * @param {*} numInches 
         * @returns ...
         */
        mmToInches: (numMils) => numMils / INCHES_MM_FACTOR,
        /**
         * ...
         * @memberof calcs.math
         * @param {*} numInches 
         * @returns ...
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
        getRandomInt: (min, max) => {
            const minCeiled = Math.ceil(min);
            const maxFloored = Math.floor(max);
            // The maximum is exclusive and the minimum is inclusive
            return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
        },
    }
}


module.exports = { init: mathUtils };

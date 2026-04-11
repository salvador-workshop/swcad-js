"use strict"

/**
 * Functions related to regular polygons
 * @memberof calcs.geometry
 * @namespace regPoly
 */

const geoRegPoly = ({ jscad, swcadJs }) => {
    return {
        /**
         * ...
         * @memberof calcs.geometry.regPoly
         * @returns ...
         */
        sideLengthFromApothem: (apothem, numSides) => {
            return apothem * 2 * Math.tan(Math.PI / numSides);
        },
        /**
         * ...
         * @memberof calcs.geometry.regPoly
         * @returns ...
         */
        sideLengthFromCircumRadius: (circumradius, numSides) => {
            return circumradius * 2 * Math.sin(Math.PI / numSides);
        },
        /**
         * ...
         * @memberof calcs.geometry.regPoly
         * @returns ...
         */
        apothemFromCircumradius: (circumradius, numSides) => {
            return circumradius * Math.cos(Math.PI / numSides)
        },
        /**
         * ...
         * @memberof calcs.geometry.regPoly
         * @returns ...
         */
        apothemFromSideLength: (sideLength, numSides) => {
            return sideLength / 2 * Math.tan(Math.PI / numSides)
        },
        /**
         * ...
         * @memberof calcs.geometry.regPoly
         * @returns ...
         */
        circumradiusFromApothem: (apothem, numSides) => {
            return apothem / Math.cos(Math.PI / numSides);
        },
        /**
         * ...
         * @memberof calcs.geometry.regPoly
         * @returns ...
         */
        circumradiusFromSideLength: (sideLength, numSides) => {
            return sideLength / 2 * Math.sin(Math.PI / numSides)
        },
        /**
         * ...
         * @memberof calcs.geometry.regPoly
         * @returns ...
         */
        interiorAngle: (numSides) => {
            return 2 * Math.PI / numSides;
        },
    }
}

module.exports = {
    init: geoRegPoly,
};

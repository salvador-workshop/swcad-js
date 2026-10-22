"use strict"

/**
 * Functions related to regular polygons
 * @namespace regPoly
 * @memberof calcs.geometry
 */

const geoRegPoly = ({ jscad, swcadJs }) => {
    return {
        /**
         * Calculates side length from apothem and # of sides
         * @memberof calcs.geometry.regPoly
         * @param {number} apothem - distance from center to the midpoint of one side
         * @param {number} numSides - number of polygon sides
         * @returns side length
         */
        sideLengthFromApothem: (apothem, numSides) => {
            return apothem * 2 * Math.tan(Math.PI / numSides);
        },
        /**
         * Calculates side length from circumradius and # of sides
         * @memberof calcs.geometry.regPoly
         * @param {number} circumradius - distance from center to vertex
         * @param {number} numSides - number of polygon sides
         * @returns side length
         */
        sideLengthFromCircumRadius: (circumradius, numSides) => {
            return circumradius * 2 * Math.sin(Math.PI / numSides);
        },
        /**
         * Calculates apothem from circumradius and # of sides
         * @memberof calcs.geometry.regPoly
         * @param {number} circumradius - distance from center to vertex
         * @param {number} numSides - number of polygon sides
         * @returns apothem
         */
        apothemFromCircumradius: (circumradius, numSides) => {
            return circumradius * Math.cos(Math.PI / numSides)
        },
        /**
         * Calculates apothem from side length and # of sides
         * @memberof calcs.geometry.regPoly
         * @param {number} sideLength - side length
         * @param {number} numSides - number of polygon sides
         * @returns apothem
         */
        apothemFromSideLength: (sideLength, numSides) => {
            return sideLength / 2 * Math.tan(Math.PI / numSides)
        },
        /**
         * Calculates circumradius from apothem and # of sides
         * @memberof calcs.geometry.regPoly
         * @param {number} apothem - distance from center to the midpoint of one side
         * @param {number} numSides - number of polygon sides
         * @returns circumradius
         */
        circumradiusFromApothem: (apothem, numSides) => {
            return apothem / Math.cos(Math.PI / numSides);
        },
        /**
         * Calculates circumradius from side length and # of sides
         * @memberof calcs.geometry.regPoly
         * @param {number} sideLength - side length
         * @param {number} numSides - number of polygon sides
         * @returns circumradius
         */
        circumradiusFromSideLength: (sideLength, numSides) => {
            return sideLength / 2 * Math.sin(Math.PI / numSides)
        },
        /**
         * Calculates interior angle from # of sides
         * @memberof calcs.geometry.regPoly
         * @param {number} numSides - number of polygon sides
         * @returns interior angle
         */
        interiorAngle: (numSides) => {
            return 2 * Math.PI / numSides;
        },
    }
}

module.exports = {
    init: geoRegPoly,
};

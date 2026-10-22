"use strict"

/**
 * Rectangle calculations
 * @memberof calcs.position
 * @namespace rectangle
 */

const geoRectangle = ({ jscad, swcadJs }) => {
    const {
        measureDimensions,
        measureBoundingBox,
        measureCenter
    } = jscad.measurements;

    const { position } = swcadJs.calcs

    /**
     * ...
     * @memberof calcs.position.rectangle
     * @param {object} rectGeom 
     * @returns ...
     */
    const getRectangleCoords = (rectGeom) => {
        return position.getGeomCoords(rectGeom)
    }

    /**
     * ...
     * @memberof calcs.position.rectangle
     * @param {object} rectGeom 
     * @returns ...
     */
    const getRectangleCorners = (rectGeom) => {
        const bBox = measureBoundingBox(rectGeom);

        const coords = getRectangleCoords(rectGeom);
        return {
            c1: [coords.right, coords.front, 0], // (+X, -Y)
            c2: [coords.right, coords.back, 0], // (+X, +Y)
            c3: [coords.left, coords.back, 0], // (-X, +Y)
            c4: [coords.left, coords.front, 0], // (-X, -Y)
        }
    }

    return {
        getRectangleCorners,
    }
}

module.exports = { init: geoRectangle };

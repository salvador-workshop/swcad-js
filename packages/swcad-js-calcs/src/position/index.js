"use strict"

/**
 * Functions leveraging JSCAD to get position data or move 2D/3D geometries.
 * @memberof calcs
 * @namespace position
 */

const positionUtils = ({ jscad, swcadJs }) => {
    const {
        align,
    } = jscad.transforms

    const {
        measureDimensions,
        measureBoundingBox,
    } = jscad.measurements


    /**
     * Common alignment modes (for JSCAD's `align()` function).
     * @memberof calcs.position
     */
    const alignModes = {
        ctr: ['center', 'center', 'center'],
        ctrMin: ['center', 'center', 'min'],
        ctrMax: ['center', 'center', 'max'],
    }

    /**
     * Centers the given geometry, relative to the given point (defaults to [0,0,0]).
     * @memberof calcs.position
     * @param {*} inGeom 
     * @param {*} pt 
     * @returns ...
     */
    const ctr = (inGeom, pt = [0, 0, 0]) => {
        return align({ modes: alignModes.ctr, relativeTo: pt }, inGeom)
    }
    /**
     * Centers the given geometry (minimum Z), relative to the given point (defaults to [0,0,0]).
     * @memberof calcs.position
     * @param {*} inGeom 
     * @param {*} pt 
     * @returns ...
     */
    const ctrMin = (inGeom, pt = [0, 0, 0]) => {
        return align({ modes: alignModes.ctrMin, relativeTo: pt }, inGeom)
    }
    /**
     * Centers the given geometry (maximum Z), relative to the given point (defaults to [0,0,0]).
     * @memberof calcs.position
     * @param {*} inGeom 
     * @param {*} pt 
     * @returns ...
     */
    const ctrMax = (inGeom, pt = [0, 0, 0]) => {
        return align({ modes: alignModes.ctrMax, relativeTo: pt }, inGeom)
    }

    /**
     * Measures key info (boundingBox, dimensions).
     * @memberof calcs.position
     * @param {object} inputGeom 
     * @returns ...
     */
    const measure = (inputGeom) => {
        return {
            boundingBox: measureBoundingBox(inputGeom),
            dimensions: measureDimensions(inputGeom),
        }
    };

    /**
     * Gets 3D bounding coordinates of a given geometry.
     * @memberof calcs.position
     * @param {object} geom 
     * @returns Bounding coords (right, left, back, front, top, bottom)
     */
    const getGeomCoords = (geom) => {
        const bBox = measureBoundingBox(geom);

        return {
            right: bBox[1][0], // (+X)
            left: bBox[0][0], // (-X)
            back: bBox[1][1], // (+Y)
            front: bBox[0][1], // (-Y)
            top: bBox[1][2], // (+Z)
            bottom: bBox[0][2], // (-Z)
        }
    }

    /**
     * Finds long axis of a coord set.
     * @memberof calcs.position
     * @param {number[]} size - [x, y, z]
     * @returns axis with longest value (either "x", "y", or "z") or `null` if invalid
     */
    const findLongAxis = (size) => {
        const is2d = size.length == 2 && size.every(sizeNum => typeof sizeNum === 'number' && sizeNum > 0)
        const is3d = size.length == 3 && size.every(sizeNum => typeof sizeNum === 'number' && sizeNum > 0)

        if (!is2d && !is3d) {
            return null
        }

        const maxDim = Math.max(...size)
        const maxDimIdx = size.indexOf(maxDim)
        const axes = ['x', 'y', 'z']

        return axes[maxDimIdx]
    }

    const positionCore = {
        alignModes,
        measure,
        getGeomCoords,
        findLongAxis,
        ctr,
        ctrMin,
        ctrMax,
    }

    return positionCore
}

module.exports = { init: positionUtils };

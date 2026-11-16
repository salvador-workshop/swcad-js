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
     * @param {object} inGeom - 2D / 3D geometry
     * @param {number[]} pt - 3D coordinate (defaults to origin)
     * @returns {void}
     */
    const ctr = (inGeom, pt = [0, 0, 0]) => {
        return align({ modes: alignModes.ctr, relativeTo: pt }, inGeom)
    }
    /**
     * Centers the given geometry (minimum Z), relative to the given point (defaults to [0,0,0]).
     * @memberof calcs.position
     * @param {object} inGeom - 2D / 3D geometry
     * @param {number[]} pt - 3D coordinate (defaults to origin)
     * @returns {void}
     */
    const ctrMin = (inGeom, pt = [0, 0, 0]) => {
        return align({ modes: alignModes.ctrMin, relativeTo: pt }, inGeom)
    }
    /**
     * Centers the given geometry (maximum Z), relative to the given point (defaults to [0,0,0]).
     * @memberof calcs.position
     * @param {object} inGeom - 2D / 3D geometry
     * @param {number[]} pt - 3D coordinate (defaults to origin)
     * @returns {void}
     */
    const ctrMax = (inGeom, pt = [0, 0, 0]) => {
        return align({ modes: alignModes.ctrMax, relativeTo: pt }, inGeom)
    }

    const positionCore = {
        alignModes,
        ctr,
        ctrMin,
        ctrMax,
    }

    return positionCore
}

module.exports = { init: positionUtils };

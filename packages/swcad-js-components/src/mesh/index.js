"use strict"

/**
 * Modelling functions that generate perforated 3D shapes.
 * @memberof components
 * @namespace mesh
 */

//-----------
// TO-DO
//---------------------
// - Cylinders with rounded corners
//---------------------

const mesh3dInit = ({ jscad, swcadJs }) => {

    const { cylinder, triangle, rectangle } = jscad.primitives
    const { translate, rotate, align, mirror } = jscad.transforms
    const { subtract, union } = jscad.booleans
    const { extrudeRotate, extrudeLinear } = jscad.extrusions
    const { TAU } = jscad.maths.constants

    const {
        math,
        position
    } = swcadJs.calcs

    const {
        standards,
    } = swcadJs.data

    const {
        mesh: mesh2d
    } = swcadJs.profiles

    /**
     * Generates a flat 3D mesh panel with the given options.
     * @memberof components.mesh
     * @param {*} opts 
     * @returns ...
     */
    const meshPanel = ({
        size,
        thickness = standards.INTERFACE_THICKNESS,
        edgeMargin = math.inchesToMm(1 / 8),
        holeRadius,
        holeDistance,
        holePattern = 'tri',
    }) => {
        const mPanelProfile = mesh2d.meshPanel({
            size: [size[0], size[1]],
            edgeMargin,
            holeRadius,
            holeDistance,
            holePattern,
        })[0]

        const mPanel = extrudeLinear({ height: thickness }, mPanelProfile)

        return mPanel
    }

    return {
        meshPanel,
    }
}

module.exports = { init: mesh3dInit };

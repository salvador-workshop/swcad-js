"use strict"

const mesh3dInit = ({ jscad, swcadJs }) => {
    const { extrudeLinear } = jscad.extrusions

    const {
        math,
        position,
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
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.size
     * @param {number} opts.thickness
     * @param {number} opts.edgeMargin
     * @param {number} opts.holeRadius
     * @param {number} opts.holeDistance
     * @param {string} opts.holePattern
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     */
    const meshPanel = (opts) => {
        const {
            size,
            thickness = standards.INTERFACE_THICKNESS,
            edgeMargin = math.inchesToMm(1 / 8),
            holeRadius,
            holeDistance,
            holePattern = 'tri',
        } = opts

        const mPanelProfile = mesh2d.meshPanel({
            size: [size[0], size[1]],
            edgeMargin,
            holeRadius,
            holeDistance,
            holePattern,
        })[0]

        let mPanel = extrudeLinear({ height: thickness }, mPanelProfile)

        mPanel = position.ctr(mPanel)

        const mainModel = mPanel

        const modelParts = {
            mainModel,
            profile: mPanelProfile,
        }

        return [mainModel, modelParts, opts]
    }

    /**
     * Modelling functions that generate perforated 3D shapes.
     * @memberof components
     * @namespace mesh
     */
    return {
        meshPanel,
    }
}

module.exports = { init: mesh3dInit };

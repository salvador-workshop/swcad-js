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
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.mesh
     * @access private
     */
    const meshPanelDefaults = () => {
        const defInterfaceThickness = standards.INTERFACE_THICKNESS

        const defaultValues = {
            constants: {
                interfaceThickness: defInterfaceThickness,
            },
            opts: {
                holePattern: 'tri',
                holeSegments: 20,
            },
            dims: {
                size: [
                    math.inchesToMm(6),
                    math.inchesToMm(3),
                ],
                thickness: defInterfaceThickness,
                edgeMargin: math.inchesToMm(3 / 16),
                holeRadius: math.inchesToMm(0.125),
                holeDistance: math.inchesToMm(1),
                gapThickness: defInterfaceThickness,
            },
            points: {},
            components: {},
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            size: defaultValues.dims.size,
            thickness: defaultValues.dims.thickness,
            edgeMargin: defaultValues.dims.edgeMargin,
            holeRadius: defaultValues.dims.holeRadius,
            holeDistance: defaultValues.dims.holeDistance,
            gapThickness: defaultValues.dims.gapThickness,
            holePattern: defaultValues.opts.holePattern,
            holeSegments: defaultValues.opts.holeSegments,
        }

        return {
            opts: defaultOpts,
            vals: defaultValues,
        }
    }


    //------------------------------------------------------------------------------


    /**
     * Initializes options with user input
     * @param {*} opts 
     * @returns model properties
     * @memberof components.mesh
     * @access private
     */
    const meshPanelOpts = (opts) => {
        const defaults = meshPanelDefaults()

        // User options
        const {
            size = defaults.opts.size,
            thickness = defaults.opts.thickness,
            edgeMargin = defaults.opts.edgeMargin,
            holeRadius = defaults.opts.holeRadius,
            holeDistance = defaults.opts.holeDistance,
            gapThickness = defaults.opts.gapThickness,
            holePattern = defaults.opts.holePattern,
            holeSegments = defaults.opts.holeSegments,
        } = opts

        const initOpts = {
            size,
            thickness,
            edgeMargin,
            holeRadius,
            holeDistance,
            gapThickness,
            holePattern,
            holeSegments
        }

        return initOpts
    }

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
     * @param {number} opts.holeSegments
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     */
    const meshPanel = (opts) => {
        const inOpts = meshPanelOpts(opts)
        const {
            thickness,
        } = inOpts

        const mPanelProfile = mesh2d.meshPanel(inOpts)[0]

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
     * Generates a flat 3D mesh lattice panel with the given options.
     * @memberof components.mesh
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.size
     * @param {number} opts.thickness
     * @param {number} opts.edgeMargin
     * @param {number} opts.holeRadius
     * @param {number} opts.gapThickness
     * @param {string} opts.holePattern
     * @param {number} opts.holeSegments
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     */
    const meshLatticePanel = (opts) => {
        const inOpts = meshPanelOpts(opts)
        const {
            thickness,
        } = inOpts

        const mPanelProfile = mesh2d.meshLatticePanel(inOpts)[0]

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
        meshLatticePanel,
    }
}

module.exports = { init: mesh3dInit };

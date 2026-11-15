/**
 * Modelling functions that generate 2D perforated shapes.
 * @memberof profiles
 * @namespace mesh
 */

const mesh2dInit = ({ jscad, swcadJs }) => {
    const {
        circle,
        rectangle,
    } = jscad.primitives

    const {
        subtract,
        union,
        intersect,
    } = jscad.booleans

    const {
        standards,
    } = swcadJs.data

    const {
        math,
        geometry,
    } = swcadJs.calcs


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof profiles.mesh
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
                edgeMargin: math.inchesToMm(3 / 16),
                holeRadius: math.inchesToMm(0.125),
                holeDistance: math.inchesToMm(1),
                lineThickness: defInterfaceThickness,
            },
            points: {},
            components: {},
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            size: defaultValues.dims.size,
            edgeMargin: defaultValues.dims.edgeMargin,
            holeRadius: defaultValues.dims.holeRadius,
            holeDistance: defaultValues.dims.holeDistance,
            lineThickness: defaultValues.dims.lineThickness,
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
     * @memberof profiles.mesh
     * @access private
     */
    const meshPanelOpts = (opts) => {
        const defaults = meshPanelDefaults()

        // User options
        const {
            size = defaults.opts.size,
            edgeMargin = defaults.opts.edgeMargin,
            holeRadius = defaults.opts.holeRadius,
            holeDistance = defaults.opts.holeDistance,
            lineThickness = defaults.opts.lineThickness,
            holePattern = defaults.opts.holePattern,
            holeSegments = defaults.opts.holeSegments,
        } = opts

        const initOpts = {
            size,
            edgeMargin,
            holeRadius,
            holeDistance,
            lineThickness,
            holePattern,
            holeSegments
        }

        return initOpts
    }

    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof profiles.mesh
     * @access private
     */
    const meshPanelProps = (opts) => {
        const defaults = meshPanelDefaults()

        const {
            size,
            edgeMargin,
            holeRadius,
            holeDistance,
            lineThickness,
            holePattern,
            holeSegments,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const width = size[0]
        const depth = size[1]

        const holeDiam = holeRadius * 2

        const meshAreaSize = [
            size[0] - holeDiam - (edgeMargin * 2),
            size[1] - holeDiam - (edgeMargin * 2),
        ]

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = defaults.vals.constants

        /** Derived user options for the model */
        const modelOpts = {
            holePattern,
            holeSegments,
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            meshAreaSize,
            width,
            depth,
            edgeMargin,
            holeRadius,
            holeDiam,
            holeDistance,
            lineThickness,
        }

        /** Various key points for model */
        const modelPoints = defaults.vals.points

        /** Components used by model */
        const modelComponents = defaults.vals.components

        /* ---------------------------------------------
        *  Model Properties
        * ----------------------------------------------
        * Properties accessible to all model functions.
        * --------------------------------------------- */

        const modelProperties = {
            constants: modelConstants,
            opts: modelOpts,
            dims: modelDims,
            points: modelPoints,
            components: modelComponents,
        }


        return modelProperties
    }

    //------------------------------------------------------------------------------

    /**
     * Builds a 2D mesh panel blank
     * @memberof profiles.mesh
     * @returns ...
     * @access private
     */
    const meshPanelBlankProfile = (modelProps) => {
        const {
            size,
        } = modelProps.dims

        const baseRect = rectangle({ size })
        return baseRect
    }

    /**
     * Builds a 2D mesh panel frame blank
     * @memberof profiles.mesh
     * @returns ...
     * @access private
     */
    const meshPanelFrameBlankProfile = (modelProps) => {
        const {
            size,
            lineThickness,
        } = modelProps.dims

        const baseRect = rectangle({ size })
        const cutRect = rectangle({
            size: [
                size[0] - (lineThickness * 2),
                size[1] - (lineThickness * 2),
            ]
        })

        return subtract(baseRect, cutRect)
    }

    /**
     * Calculates points in mesh area
     * @memberof profiles.mesh
     * @returns ...
     * @access private
     */
    const meshPanelPoints = (modelProps) => {
        const {
            meshAreaSize,
            holeDistance,
        } = modelProps.dims

        const {
            holePattern,
        } = modelProps.opts

        let pts = []

        if (holePattern == 'tri') {
            pts = geometry.points.getTriangularPtsInArea(meshAreaSize[0], meshAreaSize[1], holeDistance)
        } else {
            pts = geometry.points.getSquarePtsInArea(meshAreaSize[0], meshAreaSize[1], holeDistance)
        }

        return pts
    }

    /**
     * Builds 2D mesh panel perforations (hole punch)
     * @memberof profiles.mesh
     * @returns ...
     * @access private
     */
    const meshPanelCutProfile = (modelProps) => {
        const {
            holeSegments,
        } = modelProps.opts

        const {
            holeRadius,
        } = modelProps.dims

        const cutPts = meshPanelPoints(modelProps)

        const cutCircles = cutPts.map(cutPt => {
            return circle({
                radius: holeRadius,
                center: [cutPt.x, cutPt.y],
                segments: holeSegments,
            })
        })

        return cutCircles
    }

    /**
     * Generates a 2D mesh panel with the given options.
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.size
     * @param {number} opts.edgeMargin
     * @param {number} opts.holeRadius
     * @param {number} opts.holeDistance
     * @param {string} opts.holePattern
     * @param {number} opts.holeSegments
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.mesh
     */
    const meshPanel = (opts) => {
        const inOpts = meshPanelOpts(opts)
        const modelProperties = meshPanelProps(inOpts)

        let mPanelCutProfile = meshPanelCutProfile(modelProperties)
        let mPanelBlankProfile = meshPanelBlankProfile(modelProperties)

        const mainModel = subtract(
            mPanelBlankProfile,
            mPanelCutProfile,
        )

        const modelParts = {
            mainModel,
            blank: mPanelBlankProfile,
            cutaway: mPanelCutProfile,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a 2D mesh lattice panel with the given options.
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.size
     * @param {number} opts.edgeMargin
     * @param {number} opts.holeRadius
     * @param {number} opts.lineThickness
     * @param {string} opts.holePattern
     * @param {number} opts.holeSegments
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.mesh
     */
    const meshLatticePanel = (opts) => {
        const defaults = meshPanelDefaults()
        const inOpts = meshPanelOpts(opts)
        const modelProperties = meshPanelProps(inOpts)

        const setupOpts = {
            ...inOpts,
            size: [
                inOpts.size[0] + (inOpts.holeRadius * 6),
                inOpts.size[1] + (inOpts.holeRadius * 6),
            ],
            edgeMargin: defaults.vals.constants.interfaceThickness,
            holeDistance: inOpts.holeRadius * 2 + inOpts.lineThickness,
        }
        const setupProperties = meshPanelProps(setupOpts)
        let setupCutProfile = meshPanelCutProfile(setupProperties)
        let setupBlankProfile = meshPanelBlankProfile(setupProperties)
        const setupModel = subtract(
            setupBlankProfile,
            setupCutProfile,
        )

        const latticeFrame = meshPanelFrameBlankProfile(modelProperties)
        const keepBox = rectangle({
            size: [
                inOpts.size[0] - 0.001,
                inOpts.size[1] - 0.001,
            ]
        })
        const innerLattice = intersect(
            keepBox,
            setupModel
        )

        const mainModel = union(
            latticeFrame,
            innerLattice,
        )

        const modelParts = {
            mainModel,
            blank: setupBlankProfile,
            cutaway: setupCutProfile,
            latticeFrame,
            innerLattice,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        meshPanel,
        meshLatticePanel,
    }
}

module.exports = { init: mesh2dInit }
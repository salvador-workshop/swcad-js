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
    } = jscad.booleans

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

        /** Specific value declarations */
        const defaultValues = {
            constants: {},
            opts: {
                holePattern: 'tri',
            },
            dims: {
                size: [
                    math.inchesToMm(6),
                    math.inchesToMm(3),
                ],
                edgeMargin: math.inchesToMm(3 / 16),
                holeRadius: math.inchesToMm(0.125),
                holeDistance: math.inchesToMm(1),
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
            holePattern: defaultValues.opts.holePattern,
        }

        return {
            opts: defaultOpts,
            vals: defaultValues,
        }
    }


    //------------------------------------------------------------------------------


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
            holePattern,
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
     * Generates a 2D mesh panel with the given options.
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.size
     * @param {number} opts.edgeMargin
     * @param {number} opts.holeRadius
     * @param {number} opts.holeDistance
     * @param {string} opts.holePattern
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.mesh
     */
    const meshPanel = (opts) => {
        const defaults = meshPanelDefaults()

        // User options
        const {
            size = defaults.opts.size,
            edgeMargin = defaults.opts.edgeMargin,
            holeRadius = defaults.opts.holeRadius,
            holeDistance = defaults.opts.holeDistance,
            holePattern = defaults.opts.holePattern,
        } = opts

        const inOpts = {
            size,
            edgeMargin,
            holeRadius,
            holeDistance,
            holePattern,
        }

        const modelProperties = meshPanelProps(inOpts)

        /* ----------------------------------------
         * Modelling, Component/Assembly Modules
         * ------------------------------------- */

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
                pts = geometry.getTriangularPtsInArea(meshAreaSize[0], meshAreaSize[1], holeDistance)
            } else {
                pts = geometry.getSquarePtsInArea(meshAreaSize[0], meshAreaSize[1], holeDistance)
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
                holeRadius,
            } = modelProps.dims

            const cutPts = meshPanelPoints(modelProps)

            const cutCircles = cutPts.map(cutPt => {
                return circle({ radius: holeRadius, center: [cutPt.x, cutPt.y] })
            })

            return cutCircles
        }

        /**
         * Builds a 2D mesh panel
         * @memberof profiles.mesh
         * @returns ...
         * @access private
         */
        const meshPanelProfile = (modelProps) => {
            const {
                size,
            } = modelProps.dims

            const baseRect = rectangle({ size })
            return baseRect
        }

        /* ----------------------------------------
         * Complete Assembly
         * ------------------------------------- */

        /** Final Assembly */
        const finalAssembly = (modelProps) => {
            let subComp1 = meshPanelProfile(modelProps)
            let subComp2 = meshPanelCutProfile(modelProps)

            return subtract(
                subComp1,
                subComp2,
            )
        }

        /* ----------------------------------------
         * Outputs
         * ------------------------------------- */

        let meshPanelCutProfileInst = meshPanelCutProfile(modelProperties)
        let meshPanelProfileInst = meshPanelProfile(modelProperties)

        let mainModel = finalAssembly(modelProperties)

        let modelParts = {
            meshPanelCutProfile: meshPanelCutProfileInst,
            meshPanelProfile: meshPanelProfileInst,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        meshPanel
    }
}

module.exports = { init: mesh2dInit }
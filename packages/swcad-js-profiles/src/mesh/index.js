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

    const {
        standards,
    } = swcadJs.data

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
            dims: {
                size: [
                    math.inchesToMm(6),
                    math.inchesToMm(3),
                ],
            },
            points: {
                centre: [0, 0, 0]
            }
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            size: defaultValues.dims.size,
            interfaceThickness: standards.INTERFACE_THICKNESS,
            fitGap: standards.FIT_GAP,
            edgeMargin: math.inchesToMm(3 / 16),
            holeRadius: math.inchesToMm(0.125),
            holeDistance: math.inchesToMm(1),
            holePattern: 'tri',
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
            interfaceThickness,
            fitGap,
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
        const modelConstants = {
        }

        /** Derived user options for the model */
        const modelOpts = {
            holePattern,
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            meshAreaSize,
            interfaceThickness,
            fitGap,
            width,
            depth,
            edgeMargin,
            holeRadius,
            holeDiam,
            holeDistance,
        }

        /** Various key points for model */
        const modelPoints = {
            centre: defaults.vals.points.centre,
        }

        /** Components used by model */
        const modelComponents = {
        }

        /* ---------------------------------------------
        *  Model Properties
        * ----------------------------------------------
        * Properties accessible to all model functions.
        * --------------------------------------------- */

        const modelProperties = {
            metadata: {
                id: '9999',
                name: 'New Model',
                project: 'New Project',
                author: 'Somebody Somewhere',
                organization: 'Salvador Workshop',
                client: null,
            },
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
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
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
            // size = defaults.opts.size,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
            size = defaults.opts.size,
            edgeMargin = defaults.opts.edgeMargin,
            holeRadius = defaults.opts.holeRadius,
            holeDistance = defaults.opts.holeDistance,
            holePattern = defaults.opts.holePattern,
        } = opts

        const inOpts = {
            interfaceThickness,
            fitGap,
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
                size,
                meshAreaSize,
                edgeMargin,
                holeRadius,
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
                size,
                edgeMargin,
                holeRadius,
                holeDistance,
            } = modelProps.dims

            const {
                holePattern,
            } = modelProps.opts

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
                edgeMargin,
                holeRadius,
                holeDistance,
            } = modelProps.dims

            const {
                holePattern,
            } = modelProps.opts

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
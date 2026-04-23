/**
 * Builds 2D mesh models.
 * @memberof profiles.structure
 * @namespace mesh
 */

const mesh2dInit = ({ jscad, swcadJs }) => {
    const {
        cube,
        cylinder,
        sphere,
        cylinderElliptic,
        circle,
        cuboid,
        roundedCuboid,
        roundedCylinder,
        roundedRectangle,
        rectangle,
        triangle,
    } = jscad.primitives

    const {
        align,
        translate,
        rotate,
        mirror
    } = jscad.transforms

    const {
        intersect,
        subtract,
        union,
        scission
    } = jscad.booleans

    const {
        extrudeLinear,
        extrudeRotate,
        project
    } = jscad.extrusions

    const {
        measureDimensions,
        measureBoundingBox,
        measureVolume
    } = jscad.measurements

    const {
        hull,
        hullChain
    } = jscad.hulls

    const { vectorText } = jscad.text
    const { toOutlines } = jscad.geometries.geom2
    const { TAU } = jscad.maths.constants
    const { colorize } = jscad.colors

    const {
        math,
        position,
        geometry,
    } = swcadJs.calcs

    const {
        constants,
    } = swcadJs.data

    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof profiles.structure.mesh
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
            },
            typeDetails: {
                default: { id: 'default', desc: 'Default' },
                alt: { id: 'alt', desc: 'Alternate' },
            }
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            size: defaultValues.dims.size,
            type: 'default',
            scale: 1,
            interfaceThickness: 1.333333,
            fitGap: math.inchesToMm(1 / 128),
            logMode: 'normal',
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
     * @memberof profiles.structure.mesh
     * @access private
     */
    const meshPanelProps = (opts) => {
        const defaults = meshPanelDefaults()

        const {
            type,
            scale,
            interfaceThickness,
            fitGap,
            logMode,
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
            type,
            scale,
        }

        /** Derived user options for the model */
        const modelOpts = {
            type,
            scale,
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
     * New Model
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.structure.mesh
     */
    const meshPanel = (opts) => {
        const defaults = meshPanelDefaults()

        // User options
        const {
            // size = defaults.opts.size,
            type = defaults.opts.type,
            scale = defaults.opts.scale,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
            logMode = defaults.opts.logMode,
            size = defaults.opts.size,
            edgeMargin = defaults.opts.edgeMargin,
            holeRadius = defaults.opts.holeRadius,
            holeDistance = defaults.opts.holeDistance,
            holePattern = defaults.opts.holePattern,
        } = opts

        const inOpts = {
            type,
            scale,
            interfaceThickness,
            fitGap,
            logMode,
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
         * @memberof profiles.structure.mesh
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
         * @memberof profiles.structure.mesh
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
         * @memberof profiles.structure.mesh
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

        let subComp1 = meshPanelCutProfile(modelProperties)
        let subComp2 = meshPanelProfile(modelProperties)

        let mainModel = finalAssembly(modelProperties)

        let modelParts = {
            meshPanelCutProfile: subComp1,
            meshPanelProfile: subComp2,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        meshPanel
    }
}

module.exports = { init: mesh2dInit }
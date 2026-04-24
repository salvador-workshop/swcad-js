"use strict"

const reinforcedRectInit = ({ jscad, swcadJs }) => {
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
    } = swcadJs.calcs

    const {
        reinforcement,
    } = swcadJs.calcs.geometry


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof newModelName
     * @access private
     */
    const reinforcedRectDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            constants: {
                reinforcementPatterns: ['x', 'cross', 'diamond', 'full'],
            },
            dims: {
                size: [
                    math.inchesToMm(3),
                    math.inchesToMm(4),
                ],
                reinforcementThickness: [3, 4, 5],
            },
            points: {
                centrePt: [0, 0, 0]
            },
            types: {
                default: { id: 'default', desc: 'Default' },
                alt: { id: 'alt', desc: 'Alternate' },
            },
        }

        /** Options used by SW models */
        const standardOpts = {
            type: defaultValues.types.default.id,
            scale: 1,
            interfaceThickness: 1.333333,
            fitGap: math.inchesToMm(1 / 128),
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            ...standardOpts,
            size: defaultValues.dims.size,
            reinforcementPattern: defaultValues.constants.reinforcementPatterns,
            reinforcementThickness: defaultValues.dims.reinforcementThickness,
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
     * @memberof newModelName
     * @access private
     */
    const reinforcedRectOpts = (opts) => {
        const defaults = reinforcedRectDefaults()
        console.log('modelOpts() -- opts', opts)

        // User options
        const {
            size = defaults.opts.size,
            reinforcementPattern = defaults.opts.reinforcementPattern,
            reinforcementThickness = defaults.opts.reinforcementThickness,
            type = defaults.opts.type,
            scale = defaults.opts.scale,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
        } = opts

        const stdOpts = {
            type,
            scale,
            interfaceThickness,
            fitGap,
        }

        const initOpts = {
            size,
            reinforcementPattern,
            reinforcementThickness,
            ...stdOpts,
        }

        console.log('modelOpts() -- initOpts', initOpts)

        return initOpts
    }

    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof newModelName
     * @access private
     */
    const reinforcedRectProps = (opts) => {
        const defaults = reinforcedRectDefaults()
        console.log('modelProps() -- opts', opts)

        const {
            size,
            reinforcementPattern,
            reinforcementThickness,
            type,
            scale,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const width = size[0]
        const depth = size[1]

        const reinforcementData = reinforcement.reinforcedRectangle({
            size,
            reinforcementPattern,
        })

        let rThickness = [
            defaults.vals.dims.reinforcementThickness,
            defaults.vals.dims.reinforcementThickness,
            defaults.vals.dims.reinforcementThickness,
        ]

        if (typeof reinforcementThickness == 'number') {
            rThickness = [
                reinforcementThickness,
                reinforcementThickness,
                reinforcementThickness,
            ]
        } else if (Array.isArray(reinforcementThickness)) {
            if (reinforcementThickness.length == 3 && typeof reinforcementThickness[0] == 'number') {
                rThickness = [
                    reinforcementThickness[0],
                    reinforcementThickness[1],
                    reinforcementThickness[2],
                ]
            }
            if (reinforcementThickness.length == 2 && typeof reinforcementThickness[0] == 'number') {
                rThickness = [
                    reinforcementThickness[0],
                    reinforcementThickness[1],
                    reinforcementThickness[1],
                ]
            }
        }

        const reinforcementNodes = [
            circle({radius: rThickness[0] / 2}),
            circle({radius: rThickness[1] / 2}),
            circle({radius: rThickness[2] / 2}),
        ]

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {
        }

        /** Derived user options for the model */
        const modelOpts = {
            type,
            scale,
            reinforcementPattern,
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            width,
            depth,
            interfaceThickness,
            reinforcementThickness: rThickness,
            fitGap,
        }

        /** Various key points for model */
        const modelPoints = {
            centrePt: defaults.vals.points.centrePt,
        }

        /** Components used by model */
        const modelComponents = {
            reinforcementNodes
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

        console.log('modelProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------


    /**
     * New Model
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelName
     */
    const reinforcedRect = (opts) => {
        const defaults = reinforcedRectDefaults()
        const initOpts = reinforcedRectOpts(opts)
        const modelProperties = reinforcedRectProps(initOpts)

        /* ----------------------------------------
         * Modelling, Component/Assembly Modules
         * ------------------------------------- */

        /** Sub-component 01 */
        const subcomponent1 = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps

            return sphere()
        }

        /** Sub-component 02 */
        const subcomponent2 = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps

            return cube()
        }

        /* ----------------------------------------
         * Complete Assembly
         * ------------------------------------- */

        /** Final Assembly */
        const finalAssembly = (modelProps) => {
            let subComp1 = subcomponent1(modelProps)
            let subComp2 = subcomponent2(modelProps)

            return union(
                subComp1,
                subComp2,
            )
        }

        /* ----------------------------------------
         * Outputs
         * ------------------------------------- */

        let subComp1 = subcomponent1(modelProperties)
        let subComp2 = subcomponent2(modelProperties)

        let mainModel = finalAssembly(modelProperties)

        let modelParts = {
            subcomponent1: subComp1,
            subcomponent2: subComp2,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return reinforcedRect
}

module.exports = {
    init: reinforcedRectInit
}

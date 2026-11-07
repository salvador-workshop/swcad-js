"use strict"

const rectangularFittingInit = ({ jscad, swcadJs }) => {
    const {
        rectangle,
    } = jscad.primitives

    const {
        align,
        rotate,
    } = jscad.transforms

    const {
        subtract,
    } = jscad.booleans

    const {
        extrudeLinear,
    } = jscad.extrusions

    const {
        standards,
    } = swcadJs.data

    const {
        math,
        position,
    } = swcadJs.calcs


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.fittings
     * @access private
     */
    const rectangularFittingDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            dims: {
                subjectSize: [
                    10,
                    2,
                ],
                length: math.inchesToMm(1 / 4),
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
            interfaceThickness: standards.INTERFACE_THICKNESS,
            fitGap: standards.FIT_GAP,
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            ...standardOpts,
            subjectSize: defaultValues.dims.subjectSize,
            length: defaultValues.dims.length,
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
     * @memberof components.fittings
     * @access private
     */
    const rectangularFittingOpts = (opts) => {
        const defaults = rectangularFittingDefaults()
        console.log('rectangularFittingOpts() -- opts', opts)

        // User options
        const {
            subjectSize = defaults.opts.subjectSize,
            length = defaults.opts.length,
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
            subjectSize,
            length,
            ...stdOpts,
        }

        console.log('rectangularFittingOpts() -- initOpts', initOpts)

        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof components.fittings
     * @access private
     */
    const rectangularFittingProps = (opts) => {
        const defaults = rectangularFittingDefaults()
        console.log('rectangularFittingProps() -- opts', opts)

        const {
            subjectSize,
            length,
            type,
            scale,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const subjectWidth = subjectSize[0]
        const subjectHeight = subjectSize[1]

        const width = subjectWidth + (interfaceThickness * 2)
        const height = subjectHeight / 3 + interfaceThickness

        const cutProfileWidth = subjectWidth + fitGap
        const cutProfileHeight = subjectHeight + fitGap

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
        }

        /** Various dimensions for model */
        const modelDims = {
            subjectSize,
            subjectWidth,
            subjectHeight,
            length,
            width,
            height,
            cutProfileWidth,
            cutProfileHeight,
            interfaceThickness,
            fitGap,
        }

        /** Various key points for model */
        const modelPoints = {
            centrePt: defaults.vals.points.centrePt,
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

        console.log('rectangularFittingProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

    /**
     * Generates a 2D cutaway profile for square/rectangular fittings.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {string} opts.type - Type of the model
     * @param {number} opts.scale - Scale factor for the model
     * @param {number[]} opts.subjectSize
     * @param {number} opts.length
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.fittings
     */
    const rectFittingCutProfile = (opts) => {
        const defaults = rectangularFittingDefaults()
        const initOpts = rectangularFittingOpts(opts)
        const modelProperties = rectangularFittingProps(initOpts)

        const {
            cutProfileWidth,
            cutProfileHeight,
        } = modelProperties.dims

        const mainModel = rectangle({
            size: [
                cutProfileWidth,
                cutProfileHeight,
            ]
        })
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a fitting for square/rectangular dowels.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {string} opts.type - Type of the model
     * @param {number} opts.scale - Scale factor for the model
     * @param {number[]} opts.subjectSize
     * @param {number} opts.length
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.fittings
     */
    const rectangularFitting = (opts) => {
        const defaults = rectangularFittingDefaults()
        const initOpts = rectangularFittingOpts(opts)
        const modelProperties = rectangularFittingProps(initOpts)

        const {
            length,
            width,
            height,
            interfaceThickness,
        } = modelProperties.dims

        const baseRect = rectangle({
            size: [width, height]
        })

        const topCutaway = rectFittingCutProfile(opts)[0]

        const dHolderSection = subtract(
            align({
                modes: ['center', 'min', 'center'],
                relativeTo: [0, -interfaceThickness, 0]
            }, baseRect),
            align({ modes: ['center', 'min', 'center'] }, topCutaway),
        )

        let dHolder = extrudeLinear({ height: length }, dHolderSection)
        dHolder = rotate([Math.PI / 2, 0, 0], dHolder)

        const mainModel = position.ctr(dHolder)
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: rectangularFittingDefaults,
        props: rectangularFittingProps,
        rectFittingCutProfile,
        rectangularFitting,
    }
}

module.exports = {
    init: rectangularFittingInit
}

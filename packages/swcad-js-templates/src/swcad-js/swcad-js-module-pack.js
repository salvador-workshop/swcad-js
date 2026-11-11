"use strict"

const newModelNameInit = ({ jscad, swcadJs }) => {
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
        standards,
    } = swcadJs.data

    const {
        math,
    } = swcadJs.calcs


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof newModelParent.newModelPack
     * @access private
     */
    const newModelNameDefaults = () => {
        const defaultValues = {
            constants: {
                interfaceThickness: standards.INTERFACE_THICKNESS,
            },
            opts: {},
            dims: {
                size: [
                    math.inchesToMm(2),
                    math.inchesToMm(4),
                    math.inchesToMm(1),
                ],
            },
            points: {},
            components: {},
            types: {
                default: { id: 'default', desc: 'Default model' },
                alt: { id: 'alt', desc: 'Alternate model' },
            },
        }

        const defaultOpts = {
            fitGap: standards.FIT_GAP,
            size: defaultValues.dims.size,
            type: defaultValues.types.default.id,
            interfaceThickness: defaultValues.constants.interfaceThickness,
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
     * @memberof newModelParent.newModelPack
     * @access private
     */
    const newModelNameOpts = (opts) => {
        const defaults = newModelNameDefaults()
        console.log('newModelNameOpts() -- opts', opts)

        // User options
        const {
            size = defaults.opts.size,
            type = defaults.opts.type,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
        } = opts

        const initOpts = {
            size,
            type,
            interfaceThickness,
            fitGap,
        }

        console.log('newModelNameOpts() -- initOpts', initOpts)

        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof newModelParent.newModelPack
     * @access private
     */
    const newModelNameProps = (opts) => {
        const defaults = newModelNameDefaults()
        console.log('newModelNameProps() -- prop opts', opts)

        const {
            size,
            type,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const width = size[0]
        const depth = size[1]
        const height = size[2]

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = defaults.vals.constants

        /** Derived user options for the model */
        const modelOpts = {
            type,
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            width,
            depth,
            height,
            interfaceThickness,
            fitGap,
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

        console.log('newModelNameProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

    /**
     * New Model 1
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent.newModelPack
     */
    const model1 = (opts) => {
        const defaults = newModelNameDefaults()
        const initOpts = newModelNameOpts(opts)
        const modelProperties = newModelNameProps(initOpts)

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * New Model 2
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent.newModelPack
     */
    const model2 = (opts) => {
        const defaults = newModelNameDefaults()
        const initOpts = newModelNameOpts(opts)
        const modelProperties = newModelNameProps(initOpts)

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent.newModelPack
     */
    const model3 = (opts) => {
        const defaults = newModelNameDefaults()
        const initOpts = newModelNameOpts(opts)
        const modelProperties = newModelNameProps(initOpts)

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent.newModelPack
     */
    const model4 = (opts) => {
        const defaults = newModelNameDefaults()
        const initOpts = newModelNameOpts(opts)
        const modelProperties = newModelNameProps(initOpts)

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent.newModelPack
     */
    const model5 = (opts) => {
        const defaults = newModelNameDefaults()
        const initOpts = newModelNameOpts(opts)
        const modelProperties = newModelNameProps(initOpts)

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Modelling functions that generate new models
     * @namespace newModelPack
     * @memberof newModelParent
     */
    return {
        defaults: newModelNameDefaults,
        props: newModelNameProps,
        model1,
        model2,
        model3,
        model4,
        model5,
    }
}

module.exports = {
    init: newModelNameInit
}

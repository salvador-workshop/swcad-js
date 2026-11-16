"use strict"

const cornerBitsInit = ({ jscad, swcadJs }) => {
    const {
        extrudeRotate,
    } = jscad.extrusions

    const {
        math,
    } = swcadJs.calcs

    const {
        beadsBits,
    } = swcadJs.profiles


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.beadsBits.corner
     * @access private
     */
    const modelDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            constants: {},
            opts: {},
            dims: {
                radius1: math.inchesToMm(1 / 2),
                radius2: math.inchesToMm(3 / 4),
                offset1: 0,
                offset2: 0,
                offset3: 0,
                offset4: 0,
            },
            points: {},
            components: {},
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            radius1: defaultValues.dims.radius1,
            radius2: defaultValues.dims.radius2,
            offset1: defaultValues.dims.offset1,
            offset2: defaultValues.dims.offset2,
            offset3: defaultValues.dims.offset3,
            offset4: defaultValues.dims.offset4,
        }

        return {
            opts: defaultOpts,
            vals: defaultValues,
        }
    }


    //------------------------------------------------------------------------------


    /**
     * Initializes options with user input
     * @param {Object} opts - Options for the model
     * @param {number} opts.radius1
     * @param {number} opts.radius2
     * @param {number} opts.offset1
     * @param {number} opts.offset2
     * @param {number} opts.offset3
     * @param {number} opts.offset4
     * @returns model properties
     * @memberof components.beadsBits.corner
     * @access private
     */
    const modelOpts = (opts) => {
        const defaults = modelDefaults()

        // User options
        const {
            radius1 = defaults.opts.radius1,
            radius2 = defaults.opts.radius2,
            offset1 = defaults.opts.offset1,
            offset2 = defaults.opts.offset2,
            offset3 = defaults.opts.offset3,
            offset4 = defaults.opts.offset4,
        } = opts

        const initOpts = {
            radius1,
            radius2,
            offset1,
            offset2,
            offset3,
            offset4,
        }

        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof components.beadsBits.corner
     * @access private
     */
    const modelProps = (opts) => {
        const defaults = modelDefaults()

        const {
            radius1,
            radius2,
            offset1,
            offset2,
            offset3,
            offset4,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        // ...

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = defaults.vals.constants

        /** Derived user options for the model */
        const modelOpts = defaults.vals.opts

        /** Various dimensions for model */
        const modelDims = {
            radius1,
            radius2,
            offset1,
            offset2,
            offset3,
            offset4,
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


    /**
     * Generates a 3D rabbet bit.
     * @param {Object} opts - Options for the model
     * @param {number} opts.radius1
     * @param {number} opts.radius2
     * @param {number} opts.offset1
     * @param {number} opts.offset2
     * @param {number} opts.offset3
     * @param {number} opts.offset4
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     * @memberof components.beadsBits.corner
     */
    const rabbet = (opts) => {
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const bitProfile = beadsBits.corner.rabbet(opts)[0]
        const extrudedBit = extrudeRotate({ segments: 32 }, bitProfile)

        const mainModel = extrudedBit
        const modelParts = {
            mainModel,
            bitProfile,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a 3D chamfer bit.
     * @param {Object} opts - Options for the model
     * @param {number} opts.radius1
     * @param {number} opts.radius2
     * @param {number} opts.offset1
     * @param {number} opts.offset2
     * @param {number} opts.offset3
     * @param {number} opts.offset4
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     * @memberof components.beadsBits.corner
     */
    const chamfer = (opts) => {
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const bitProfile = beadsBits.corner.chamfer(opts)[0]
        const extrudedBit = extrudeRotate({ segments: 32 }, bitProfile)

        const mainModel = extrudedBit
        const modelParts = {
            mainModel,
            bitProfile,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a 3D round-over bit.
     * @param {Object} opts - Options for the model
     * @param {number} opts.radius1
     * @param {number} opts.radius2
     * @param {number} opts.offset1
     * @param {number} opts.offset2
     * @param {number} opts.offset3
     * @param {number} opts.offset4
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     * @memberof components.beadsBits.corner
     */
    const roundOver = (opts) => {
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const bitProfile = beadsBits.corner.roundOver(opts)[0]
        const extrudedBit = extrudeRotate({ segments: 32 }, bitProfile)

        const mainModel = extrudedBit
        const modelParts = {
            mainModel,
            bitProfile,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a 3D cove bit.
     * @param {Object} opts - Options for the model
     * @param {number} opts.radius1
     * @param {number} opts.radius2
     * @param {number} opts.offset1
     * @param {number} opts.offset2
     * @param {number} opts.offset3
     * @param {number} opts.offset4
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     * @memberof components.beadsBits.corner
     */
    const cove = (opts) => {
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const bitProfile = beadsBits.corner.cove(opts)[0]
        const extrudedBit = extrudeRotate({ segments: 32 }, bitProfile)

        const mainModel = extrudedBit
        const modelParts = {
            mainModel,
            bitProfile,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Modelling functions that generate 3D geometries which emulate woodworking router bits.
     * @namespace corner
     * @memberof components.beadsBits
     */
    return {
        rabbet,
        chamfer,
        roundOver,
        cove,
    }
}


module.exports = {
    init: cornerBitsInit
}

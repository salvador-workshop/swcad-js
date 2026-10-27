"use strict"

const roundFittingInit = ({ jscad, swcadJs }) => {
    const {
        circle,
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
        subtract,
    } = jscad.booleans

    const {
        extrudeLinear,
    } = jscad.extrusions

    const {
        math,
        position,
    } = swcadJs.calcs


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof roundFitting
     */
    const roundFittingDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            dims: {
                dowelRadius: 3.25 / 2,
                length: math.inchesToMm(1 / 4),
            },
            points: {
                centre: [0, 0, 0]
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
            dowelRadius: defaultValues.dims.dowelRadius,
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
     * @memberof roundFitting
     */
    const roundFittingOpts = (opts) => {
        const defaults = roundFittingDefaults()
        console.log('roundFittingOpts() -- opts', opts)

        // User options
        const {
            dowelRadius = defaults.opts.dowelRadius,
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
            dowelRadius,
            length,
            ...stdOpts,
        }

        console.log('roundFittingOpts() -- initOpts', initOpts)

        return initOpts
    }

    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof roundFitting
     */
    const roundFittingProps = (opts) => {
        const defaults = roundFittingDefaults()
        console.log('roundFittingProps() -- opts', opts)

        const {
            dowelRadius,
            length,
            type,
            scale,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const dowelDiam = dowelRadius * 2
        const width = interfaceThickness * 2 + dowelDiam
        const simpleHeight = dowelDiam / 3 + interfaceThickness
        const types = ['default', 'alt']


        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Derived user options for the model */
        const modelOpts = {
            type,
            scale,
            types,
        }
        /** Various dimensions for model */
        const modelDims = {
            dowelRadius,
            dowelDiam,
            width,
            simpleHeight,
            length,
            interfaceThickness,
            fitGap,
        }

        /** Various key points for model */
        const modelPoints = {
            centre: defaults.vals.points.centre,
        }

        const modelConstants = {
            ratioDiamToHolderHeight: 1.666667,
            ratioDiamToChannelDepth: 0.866667,
            ratioDiamToSideChannelWidth: 1,
            ratioDiamToDowelDepth: 0.333333,
        }

        const modelComponents = {}

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

        console.log('roundFittingProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------

    /**
     * Simple dowel fitting (round groove)
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent
     */
    const roundFitting = (opts) => {
        const defaults = roundFittingDefaults()
        const initOpts = roundFittingOpts(opts)
        const modelProperties = roundFittingProps(initOpts)

        const {
            dowelRadius,
            dowelDiam,
            interfaceThickness,
            fitGap,
            length,
            width,
            simpleHeight,
        } = modelProperties.dims

        const baseRect = rectangle({
            size: [width, simpleHeight]
        })

        const topCutaway = circle({ radius: fitGap / 2 + dowelRadius })

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

    /**
     * Simple dowel fitting, inverted for 3D-printing from the bottom (triangular groove)
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent
     */
    const inverseRoundFitting = (opts) => {
        const defaults = roundFittingDefaults()
        const initOpts = roundFittingOpts(opts)
        const modelProperties = roundFittingProps(initOpts)

        const {
            dowelRadius,
            dowelDiam,
            interfaceThickness,
            fitGap,
            length,
            width,
            simpleHeight,
        } = modelProperties.dims

        const baseRect = rectangle({
            size: [width, simpleHeight]
        })

        const topCutaway = circle({ radius: fitGap / 2 + dowelRadius })

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

    /**
     * Fitting that accomodates 2 primary dowels, plus space for 2 side dowels 
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof extModels
     */
    const doubleRoundFitting = (opts) => {
        const defaults = roundFittingDefaults()
        const initOpts = roundFittingOpts(opts)
        const modelProperties = roundFittingProps(initOpts)

        /* ----------------------------------------
         * Modelling, Component/Assembly Modules
         * ------------------------------------- */

        const roundFittingSection = (modelProps) => {
            const {
                ratioDiamToHolderHeight,
                ratioDiamToChannelDepth,
                ratioDiamToSideChannelWidth,
                ratioDiamToDowelDepth,
            } = modelProps.constants

            const {
                dowelRadius,
                dowelDiam,
                interfaceThickness,
                fitGap,
                width,
            } = modelProps.dims

            const baseRect = rectangle({
                size: [
                    width,
                    dowelDiam * ratioDiamToHolderHeight,
                ]
            })

            const topCutaway = circle({ radius: fitGap / 2 + dowelRadius })
            const channelCutaway = triangle({
                type: 'SSS', values: [
                    dowelDiam + fitGap,
                    dowelDiam + fitGap,
                    dowelDiam + fitGap
                ]
            })
            let sideCutaway1 = triangle({
                type: 'ASA', values: [
                    Math.PI / 6,
                    dowelDiam * ratioDiamToSideChannelWidth,
                    Math.PI / 6,
                ]
            })
            sideCutaway1 = rotate([0, 0, Math.PI / -2], sideCutaway1)
            const sideCutaway2 = mirror({ normal: [1, 0, 0] }, sideCutaway1)

            let dHolderSection = subtract(
                align({ modes: ['center', 'min', 'center'] }, baseRect),
                align({ modes: ['center', 'min', 'center'] }, channelCutaway),
            )

            dHolderSection = subtract(
                align({ modes: ['center', 'max', 'center'] }, dHolderSection),
                translate([0, dowelRadius / 3, 0], topCutaway),
            )

            dHolderSection = subtract(
                align({ modes: ['min', 'center', 'center'] }, dHolderSection),
                align({ modes: ['min', 'center', 'center'] }, sideCutaway1),
            )

            dHolderSection = subtract(
                align({ modes: ['max', 'center', 'center'] }, dHolderSection),
                align({ modes: ['max', 'center', 'center'] }, sideCutaway2),
            )

            return position.ctr(dHolderSection)
        }

        /* ----------------------------------------
         * Complete Assembly
         * ------------------------------------- */

        /** Final Assembly */
        const finalAssembly = (modelProps) => {
            const {
                length,
            } = modelProps.dims


            const dHolderSection = roundFittingSection(modelProps)

            let dHolder = extrudeLinear({ height: length }, dHolderSection)
            dHolder = rotate([Math.PI / 2, 0, 0], dHolder)

            return position.ctr(dHolder)
        }

        /* ----------------------------------------
         * Outputs
         * ------------------------------------- */

        const roundFittingSectionInst = roundFittingSection(modelProperties)

        const mainModel = finalAssembly(modelProperties)

        const modelParts = {
            roundFittingSection: roundFittingSectionInst,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: roundFittingDefaults,
        props: roundFittingProps,
        roundFitting,
        inverseRoundFitting,
        doubleRoundFitting,
    }
}

module.exports = {
    init: roundFittingInit
}

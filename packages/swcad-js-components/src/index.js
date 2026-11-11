"use strict"

const beadsBitsModule = require('./beads-bits')
const componentLineModule = require('./component-line')
const fittingsModule = require('./fittings')
const meshModule = require('./mesh')
const reinforcementsModule = require('./reinforcements')
const routedShapesModule = require('./routed-shapes')
const textModule = require('./text')

const reinforcementBracketsModule = require('./reinforcements/brackets')
const reinforcedLengthModule = require('./reinforcements/reinforced-length')

const componentsInit = ({ jscad, swcadJs }) => {
    const beadsBits = beadsBitsModule.init({ jscad, swcadJs })
    const preLib = {
        ...swcadJs,
        components: {
            beadsBits
        }
    }

    const routedShapes = routedShapesModule.init({ jscad, swcadJs: preLib })
    const mesh = meshModule.init({ jscad, swcadJs: preLib })
    const componentLine = componentLineModule.init({ jscad, swcadJs: preLib })
    const setupReinforcements = reinforcementsModule.init({ jscad, swcadJs: preLib })

    preLib.components = {
        beadsBits,
        routedShapes,
        mesh,
        componentLine,
        reinforcements: setupReinforcements,
    }

    const finalReinforcements = {
        ...setupReinforcements,
        brackets: reinforcementBracketsModule.init({ jscad, swcadJs: preLib }),
        reinforcedLength: reinforcedLengthModule.init({ jscad, swcadJs: preLib }),
    }

    /**
     * Modelling functions that generate 3D geometries.
     * @namespace components
     * @author R. J. Salvador (Salvador Workshop)
     */
    const components = {
        beadsBits,
        routedShapes,
        mesh,
        componentLine,
        fittings: fittingsModule.init({ jscad, swcadJs: preLib }),
        reinforcements: finalReinforcements,
        text: textModule.init({ jscad, swcadJs: preLib }),
    }

    return components
}

module.exports = {
    init: componentsInit,
};

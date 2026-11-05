"use strict"

const beadsBitsModule = require('./beads-bits')
const componentLineModule = require('./component-line')
const fittingsModule = require('./fittings')
const meshModule = require('./mesh')
const reinforcementsModule = require('./reinforcements')
const routedShapesModule = require('./routed-shapes')
const textModule = require('./text')

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
    preLib.components = {
        beadsBits,
        routedShapes,
        mesh,
        componentLine,
    }

    /**
     * Components
     * @namespace components
     * @author R. J. Salvador (Salvador Workshop)
     */
    const components = {
        beadsBits,
        routedShapes,
        mesh,
        componentLine,
        fittings: fittingsModule.init({ jscad, swcadJs: preLib }),
        reinforcements: reinforcementsModule.init({ jscad, swcadJs: preLib }),
        text: textModule.init({ jscad, swcadJs: preLib }),
    }

    return components
}

module.exports = {
    init: componentsInit,
};

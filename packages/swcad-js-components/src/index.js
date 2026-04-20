"use strict"

const beadsBitsModule = require('./beads-bits')
const componentLineModule = require('./component-line')
const meshModule = require('./mesh')
const mouldingModule = require('./moulding')
const openWebJoistModule = require('./open-web-joist')
const routedShapesModule = require('./routed-shapes')
const sheetMouldModule = require('./sheet-mould')
const textModule = require('./text')
const trimFamilyFrameModule = require('./trim-family-frame')

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
        moulding: mouldingModule.init({ jscad, swcadJs: preLib }),
        openWebJoist: openWebJoistModule.init({ jscad, swcadJs: preLib }),
        sheetMould: sheetMouldModule.init({ jscad, swcadJs: preLib }),
        text: textModule.init({ jscad, swcadJs: preLib }),
        trimFamilyFrame: trimFamilyFrameModule.init({ jscad, swcadJs: preLib }),
    }

    return components
}

module.exports = {
    init: componentsInit,
};

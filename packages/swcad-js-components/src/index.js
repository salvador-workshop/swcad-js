"use strict"

const beadsBitsModule = require('./beads-bits')
const meshModule = require('./mesh')
const moulding = require('./moulding')
const openWebJoist = require('./open-web-joist')
const routedShapesModule = require('./routed-shapes')
const sheetMould = require('./sheet-mould')
const text = require('./text')

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
    preLib.components = {
        beadsBits,
        routedShapes,
        mesh,
    }

    return {
        beadsBits,
        routedShapes,
        mesh,
        moulding: moulding.init({ jscad, swcadJs: preLib }),
        openWebJoist: openWebJoist.init({ jscad, swcadJs: preLib }),
        sheetMould: sheetMould.init({ jscad, swcadJs: preLib }),
        text: text.init({ jscad, swcadJs: preLib }),
    }
}

module.exports = {
    init: componentsInit,
};

"use strict"

const beadsBitsModule = require('./beads-bits')
const mesh = require('./mesh')
const moulding = require('./moulding')
const openWebJoist = require('./open-web-joist')
const routedShapes = require('./routed-shapes')
const text = require('./text')

const componentsInit = ({ jscad, swcadJs }) => {
    const beadsBits = beadsBitsModule.init({ jscad, swcadJs })

    const preLib = {
        ...swcadJs,
        components: {
            beadsBits
        }
    }

    return {
        beadsBits,
        mesh: mesh.init({ jscad, swcadJs: preLib }),
        moulding: moulding.init({ jscad, swcadJs: preLib }),
        openWebJoist: openWebJoist.init({ jscad, swcadJs: preLib }),
        routedShapes: routedShapes.init({ jscad, swcadJs: preLib }),
        text: text.init({ jscad, swcadJs: preLib }),
    }
}

module.exports = {
    init: componentsInit,
};

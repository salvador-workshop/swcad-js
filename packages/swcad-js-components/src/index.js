"use strict"

const beadsBits = require('./beads-bits')
const mesh = require('./mesh')
const mouldings = require('./mouldings')
const openWebJoist = require('./open-web-joist')
const text = require('./text')

const componentsInit = ({ jscad, swcadJs }) => {
    return {
        beadsBits: beadsBits.init({ jscad, swcadJs }),
        mesh: mesh.init({ jscad, swcadJs }),
        mouldings: mouldings.init({ jscad, swcadJs }),
        openWebJoist: openWebJoist.init({ jscad, swcadJs }),
        text: text.init({ jscad, swcadJs }),
    }
}

module.exports = {
    init: componentsInit,
};

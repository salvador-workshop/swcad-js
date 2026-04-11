"use strict"

const beadsBits = require('./beads-bits')
const connections = require('./connections')
const curve = require('./curve')
const reinforcement = require('./reinforcement')
const shapes = require('./shapes')
const rectFrame = require('./shapes/rectangle/frame-rect')
const structure = require('./structure')
const text = require('./text')
const trim = require('./trim')

const profilesInit = ({ jscad, swcadJs }) => {
    const shapesCore = shapes.init({ jscad, swcadJs })
    const curveCore = curve.init({ jscad, swcadJs })

    const preLib = {
        ...swcadJs,
        profiles: {
            shapes: shapesCore,
            curve: curveCore,
        }
    }

    const outShapes = {
        ...shapesCore,
        rectangle: {
            ...shapesCore.rectangle,
            frame: rectFrame.init({ jscad, swcadJs: preLib }),
        }
    }

    return {
        shapes: outShapes,
        beadsBits: beadsBits.init({ jscad, swcadJs: preLib }),
        connections: connections.init({ jscad, swcadJs: preLib }),
        curve: curveCore,
        reinforcement: reinforcement.init({ jscad, swcadJs: preLib }),
        structure: structure.init({ jscad, swcadJs: preLib }),
        text: text.init({ jscad, swcadJs: preLib }),
        trim: trim.init({ jscad, swcadJs: preLib }),
    }
}

module.exports = {
    init: profilesInit,
};

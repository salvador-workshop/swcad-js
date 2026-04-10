"use strict"

const profiles = require('./profiles')
const beadsBits = require('./beads-bits')
const connections = require('./connections')
const curve = require('./curve')
const reinforcement = require('./reinforcement')
const shapes = require('./shapes')
const structure = require('./structure')
const text = require('./text')
const trim = require('./trim')

const profilesInit = ({ jscad, swcadJs }) => {
    const shapesCore = shapes.init({ jscad, swcadJs })

    const preLib = {
        ...swcadJs,
        profiles: {
            ...shapesCore,
        }
    }

    return {
        ...shapesCore,
        beadsBits: beadsBits.init({ jscad, swcadJs: preLib }),
        connections: connections.init({ jscad, swcadJs: preLib }),
        curve: curve.init({ jscad, swcadJs: preLib }),
        reinforcement: reinforcement.init({ jscad, swcadJs: preLib }),
        shapes: shapes.init({ jscad, swcadJs: preLib }),
        structure: structure.init({ jscad, swcadJs: preLib }),
        text: text.init({ jscad, swcadJs: preLib }),
        trim: trim.init({ jscad, swcadJs: preLib }),
    }
}

module.exports = {
    init: profilesInit,
};

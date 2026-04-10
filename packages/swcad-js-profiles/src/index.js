"use strict"

const profiles = require('./profiles')
const connections = require('./connections')
const reinforcement = require('./reinforcement')
const shapes = require('./shapes')
const structure = require('./structure')
const text = require('./text')
const trim = require('./trim')

const profilesInit = ({ jscad, swcadJs }) => {
    return {
        ...profiles.init({ jscad, swcadJs }),
        connections: connections.init({ jscad, swcadJs }),
        reinforcement: reinforcement.init({ jscad, swcadJs }),
        shapes: shapes.init({ jscad, swcadJs }),
        structure: structure.init({ jscad, swcadJs }),
        text: text.init({ jscad, swcadJs }),
        trim: trim.init({ jscad, swcadJs }),
    }
}

module.exports = {
    init: profilesInit,
};

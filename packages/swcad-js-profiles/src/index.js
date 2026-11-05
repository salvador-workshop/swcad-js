"use strict"

const beadsBitsModule = require('./beads-bits')
const connectionsModule = require('./connections')
const jointPanelModule = require('./joint-panel')
const meshModule = require('./mesh')
const reinforcementsModule = require('./reinforcements')
const textModule = require('./text')

const profilesInit = ({ jscad, swcadJs }) => {
    const connections = connectionsModule.init({ jscad, swcadJs })

    let preLib = {
        ...swcadJs,
        profiles: {
            connections
        }
    }

    const connectionsApi = {
        ...connections,
        jointPanel: jointPanelModule.init({ jscad, swcadJs: preLib })
    }

    return {
        beadsBits: beadsBitsModule.init({ jscad, preLib }),
        connections: connectionsApi,
        mesh: meshModule.init({ jscad, swcadJs: preLib }),
        reinforcements: reinforcementsModule.init({ jscad, swcadJs: preLib }),
        text: textModule.init({ jscad, swcadJs: preLib }),
    }
}

module.exports = {
    init: profilesInit,
};

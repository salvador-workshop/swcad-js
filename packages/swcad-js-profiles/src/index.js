"use strict"

const beadsBitsModule = require('./beads-bits')
const connectionsModule = require('./connections')
const jointPanelModule = require('./connections/joint-panel')
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

    /**
     * Modelling functions that generate 2D geometries.
     * @namespace profiles
     * @author R. J. Salvador (Salvador Workshop)
     */
    return {
        beadsBits: beadsBitsModule.init({ jscad, swcadJs: preLib }),
        connections: connectionsApi,
        mesh: meshModule.init({ jscad, swcadJs: preLib }),
        reinforcements: reinforcementsModule.init({ jscad, swcadJs: preLib }),
        text: textModule.init({ jscad, swcadJs: preLib }),
    }
}

module.exports = {
    init: profilesInit,
};

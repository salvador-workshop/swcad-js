"use strict"

const profilesInit = ({ jscad, swcadJs }) => {
    const profiles = {
        connections: require('./connections').init({ jscad, swcadJs }),
        reinforcement: require('./reinforcement').init({ jscad, swcadJs }),
        mesh: require('./mesh-2d').init({ jscad, swcadJs }),
    }

    return profiles
}

module.exports = { init: profilesInit };

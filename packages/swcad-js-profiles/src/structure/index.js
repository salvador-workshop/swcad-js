"use strict"

const profilesInit = ({ jscad, swcadJs }) => {
    const profiles = {
        ...require('../profiles').init({ jscad, swcadJs }),
        foils2d: require('./foils-2d').init({ jscad, swcadJs }),
        text2d: require('../text').init({ jscad, swcadJs }),
        arch: require('./arch-2d').init({ jscad, swcadJs }),
    }

    return profiles
}

module.exports = { init: profilesInit };

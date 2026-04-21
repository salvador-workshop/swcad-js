"use strict"

const lumber = require('./lumber')
const paper = require('./paper')

const profileSpecInit = ({ jscad, swcadJs }) => {
    
    /**
     * Spec. Profiles
     * @namespace profileSpec
     * @author R. J. Salvador (Salvador Workshop)
     */
    
    const profileSpec = {
        lumber: lumber.init({ jscad, swcadJs }),
        paper: paper.init({ jscad, swcadJs }),
    }

    return profileSpec
}

module.exports = {
    init: profileSpecInit,
};

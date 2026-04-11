"use strict"

const lumber = require('./lumber')
const paper = require('./paper')

const profileSpecInit = ({ jscad, swcadJs }) => {
    return {
        lumber: lumber.init({ jscad, swcadJs }),
        paper: paper.init({ jscad, swcadJs }),
    }
}

module.exports = {
    init: profileSpecInit,
};

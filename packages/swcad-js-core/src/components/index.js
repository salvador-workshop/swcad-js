"use strict"

const componentsInit = ({ jscad, swcadJs }) => {
    const components = {}

    components.beadsBits = require('./beads-bits').init({ jscad, swcadJs });
    components.openWebJoist = require('./open-web-joist').init({ jscad, swcadJs });

    return components;
}

module.exports = { init: componentsInit };

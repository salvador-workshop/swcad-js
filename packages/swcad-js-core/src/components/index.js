"use strict"

const componentsInit = ({ lib }) => {
    const components = {}

    components.beadsBits = require('./beads-bits').init({ lib });
    components.openWebJoist = require('./open-web-joist').init({ lib });

    return components;
}

module.exports = { init: componentsInit };

"use strict"

const componentsInit = ({ lib, swJscad }) => {
    const components = {}

    components.beadsBits = require('./beads-bits').init({ lib, swJscad });
    components.openWebJoist = require('./open-web-joist').init({ lib, swJscad });

    return components;
}

module.exports = { init: componentsInit };

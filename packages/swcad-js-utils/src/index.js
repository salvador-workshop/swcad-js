const uxModule = require('./ux');

const init = ({ lib, swLib }) => {
    let swJscadUi = {
        ux: { ...uxModule.init({ lib, swLib }) }
    }

    return swJscadUi;
}

module.exports = { init };

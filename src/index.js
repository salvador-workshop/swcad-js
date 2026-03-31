const coreModule = require('swcad-js-core');

const init = ({ lib }) => {
    const swcadJs = coreModule.init({ lib })
    return swcadJs;
}

module.exports = { init };

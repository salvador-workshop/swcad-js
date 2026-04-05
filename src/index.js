const coreModule = require('../packages/swcad-js-core');

const init = ({ jscad }) => {
    const swcadJs = coreModule.init({ jscad })
    return swcadJs;
}

module.exports = { init };

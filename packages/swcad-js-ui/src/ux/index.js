
const init = ({ lib, swLib }) => {
    const ux = {
        colors: require('./colors').init({ lib }),
        palette: require('./palette').init({ lib }),
    }

    ux.layers = require('./layers').init({ lib });
    ux.layout = require('./layout').init({ lib, swLib });

    return ux;
}

module.exports = { init };

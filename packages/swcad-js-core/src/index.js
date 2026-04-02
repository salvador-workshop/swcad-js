const componentsModule = require('./components');

const init = ({ lib }) => {
    const swJsCad = require('./sw-jscad').init({ lib });

    const profiles = {
        text: swJsCad.models.profiles.text2d,
        mesh: swJsCad.models.profiles.mesh2d,
        foil: swJsCad.models.profiles.foils2d,
        arch: swJsCad.builders.arches,
        trim: swJsCad.families.trim,
        lumber: swJsCad.families.lumber,
        paper: swJsCad.families.paper,
        connections: swJsCad.models.profiles.connections,
        curves: swJsCad.models.profiles.curves,
        edge: swJsCad.models.profiles.edge,
        frameRect: swJsCad.models.profiles.frameRect,
        reinforcement: swJsCad.models.profiles.reinforcement,
        shapes: {
            ellipse: swJsCad.models.profiles.ellipse,
            octagon: swJsCad.models.profiles.octagonal,
            rectangle: swJsCad.models.profiles.rectangle,
            triangle: swJsCad.models.profiles.triangle,
            square: {
                sqCornerCircNotch: swJsCad.models.profiles.sqCornerCircNotch,
                sqCornerCircles: swJsCad.models.profiles.sqCornerCircles,
            }
        }
    }

    const componentsData = componentsModule.init({ lib });

    const components = {
        ...componentsData,
        text: swJsCad.models.prefab.text3d,
        mesh: swJsCad.models.prefab.mesh3d,
        tile: swJsCad.families.tile,
        crafts: swJsCad.families.crafts,
        moulding: swJsCad.models.prefab.mouldings,
        dowelFittings: swJsCad.families.dowelFittings,
        brick: swJsCad.families.brick,
    }

    const models = {
        foil: swJsCad.models.prefab.foils3d,
        arch: swJsCad.builders.arches,
        buttress: swJsCad.builders.buttress,
        wall: {
            ...swJsCad.builders.walls,
            entryway: swJsCad.builders.entryways
        },
        column: swJsCad.builders.columns,
        roof: swJsCad.builders.roofs,
    }

    const utils = {
        constants: swJsCad.core.constants,
        math: swJsCad.core.maths,
        geometry: swJsCad.core.geometry,
        position: swJsCad.core.position,
        extras: swJsCad.utils.extras,
        transform: swJsCad.utils.transform,
        specifications: swJsCad.core.specifications,
        standards: swJsCad.core.standards,
        colors: swJsCad.ui.ux.colors,
        layout: swJsCad.ui.ux.layout,
    }

    /** Functions organized in the new style */
    const swcadJs = {
        profiles,
        components,
        models,
        utils,
    }

    return swcadJs;
}

module.exports = { init };

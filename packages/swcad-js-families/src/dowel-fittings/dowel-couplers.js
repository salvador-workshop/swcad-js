"use strict"

/**
 * ...
 * @namespace families.dowelFittings.dowelCouplers
 */

/**
 * ...
 * @param {*} param0 
 * @returns ...
 */
const dowelCouplers = ({ lib, swLib }) => {
    const { maths } = swLib.core
    const { mesh3d } = swLib.models.prefab;

    // TODO - pull this from `sw-jscad-std-specs` once it's in place.
    const swDefaults = {
        panelThicknessXs: maths.inchesToMm(2 / 64),  // 1/32"
        panelThicknessSm: maths.inchesToMm(3 / 64),
        panelThicknessMd: maths.inchesToMm(4 / 64),   // 1/16"
        panelThicknessLg: maths.inchesToMm(5 / 64),
        panelThicknessXl: maths.inchesToMm(6 / 64),   // 3/32"
    }

    const couplerDefaultSpecs = {
        tolerance: maths.inchesToMm(1 / 64),
        typThickness: swDefaults.panelThicknessSm,
        offsetWidth: swDefaults.panelThicknessXs,
        meshRadius: swDefaults.panelThicknessMd,
    }

    const extraSmallDowelCoupler = ({ dowelRadius }) => {
        const couplerSpecs = {
            ...couplerDefaultSpecs,
            length: maths.inchesToMm(0.5)
        }

        const fittedRadius = dowelRadius + (couplerSpecs.tolerance / 2)
        return mesh3d.meshCylinder({
            radius: fittedRadius + couplerSpecs.typThickness,
            height: couplerSpecs.length,
            thickness: couplerSpecs.typThickness,
            meshRadius: couplerSpecs.meshRadius,
            meshMinWidth: couplerSpecs.typThickness,
            meshSegments: 8,
            edgeOffsets: [couplerSpecs.offsetWidth, couplerSpecs.offsetWidth],
        });
    };

    const smallDowelCoupler = ({ dowelRadius }) => {
        const couplerSpecs = {
            ...couplerDefaultSpecs,
            length: maths.inchesToMm(1)
        }

        const fittedRadius = dowelRadius + (couplerSpecs.tolerance / 2)
        return mesh3d.meshCylinder({
            radius: fittedRadius + couplerSpecs.typThickness,
            height: couplerSpecs.length,
            thickness: couplerSpecs.typThickness,
            meshRadius: couplerSpecs.meshRadius,
            meshMinWidth: couplerSpecs.typThickness,
            meshSegments: 8,
            edgeOffsets: [couplerSpecs.offsetWidth, couplerSpecs.offsetWidth],
        });
    };

    const mediumDowelCoupler = ({ dowelRadius }) => {
        const couplerSpecs = {
            ...couplerDefaultSpecs,
            length: maths.inchesToMm(2)
        }

        const fittedRadius = dowelRadius + (couplerSpecs.tolerance / 2)
        return mesh3d.meshCylinder({
            radius: fittedRadius + couplerSpecs.typThickness,
            height: couplerSpecs.length,
            thickness: couplerSpecs.typThickness,
            meshRadius: couplerSpecs.meshRadius,
            meshMinWidth: couplerSpecs.typThickness,
            meshSegments: 8,
            edgeOffsets: [couplerSpecs.offsetWidth, couplerSpecs.offsetWidth],
        });
    };

    const largeDowelCoupler = ({ dowelRadius }) => {
        const couplerSpecs = {
            ...couplerDefaultSpecs,
            length: maths.inchesToMm(3)
        }

        const fittedRadius = dowelRadius + (couplerSpecs.tolerance / 2)
        return mesh3d.meshCylinder({
            radius: fittedRadius + couplerSpecs.typThickness,
            height: couplerSpecs.length,
            thickness: couplerSpecs.typThickness,
            meshRadius: couplerSpecs.meshRadius,
            meshMinWidth: couplerSpecs.typThickness,
            meshSegments: 8,
            edgeOffsets: [couplerSpecs.offsetWidth, couplerSpecs.offsetWidth],
        });
    };

    const output = {
        extraSmallDowelCoupler,
        smallDowelCoupler,
        mediumDowelCoupler,
        largeDowelCoupler,
    }

    return output;
}

module.exports = { init: dowelCouplers }

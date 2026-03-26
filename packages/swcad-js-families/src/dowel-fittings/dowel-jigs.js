"use strict"

/**
 * ...
 * @namespace families.dowelFittings.dowelJigs
 */

/**
 * ...
 * @param {*} param0 
 * @returns ...
 */
const dowelJigs = ({ lib, swLib }) => {
    const { cuboid } = lib.primitives;
    const { union, subtract } = lib.booleans;
    const { align } = lib.transforms;

    const { mesh3d } = swLib.models.prefab;
    const { transform } = swLib.utils;
    const { maths, position } = swLib.core
    const { EQUI_TRIANGLE_HEIGHT_FACTOR, PHI_INV } = swLib.core.constants

    // TODO - pull this from `sw-jscad-std-specs` once it's in place.
    const swDefaults = {
        panelThicknessXs: maths.inchesToMm(2 / 64),  // 1/32"
        panelThicknessSm: maths.inchesToMm(3 / 64),
        panelThicknessMd: maths.inchesToMm(4 / 64),   // 1/16"
        panelThicknessLg: maths.inchesToMm(5 / 64),
        panelThicknessXl: maths.inchesToMm(6 / 64),   // 3/32"
    }

    const jigSpecDefaults = {
        tolerance: maths.inchesToMm(1 / 64),
        typThickness: swDefaults.panelThicknessMd,
        basePlateThickness: swDefaults.panelThicknessSm,
        sideMargin: maths.inchesToMm(1 / 8),
        baseMargin: maths.inchesToMm(1 / 4),
        // Percentage of total height. Must be over 50%
        jigSideHeightFactor: PHI_INV,
    }

    const completeJigSpecs = ({
        initSpecs,
    }) => {
        const outSpecs = {
            ...initSpecs
        }

        // 'single', 'rect2x2', 'tri', 'hex'
        outSpecs.pattern = initSpecs.pattern || 'single'

        outSpecs.holderCutouts = {
            height: initSpecs.dowelBundleHeight * initSpecs.jigSideHeightFactor,
        }

        outSpecs.holderHeight = outSpecs.holderCutouts.height + initSpecs.baseMargin
        outSpecs.holderWidth = 2 * initSpecs.sideMargin + initSpecs.dowelBundleWidth
        outSpecs.holderDepth = outSpecs.holderWidth * initSpecs.jigSideHeightFactor
        outSpecs.holderDepthCompact = outSpecs.holderDepth * initSpecs.jigSideHeightFactor

        outSpecs.holderCutouts.depth = outSpecs.holderDepth * 1.5

        switch (outSpecs.pattern) {
            case 'tri':
                outSpecs.holderCutouts.upperWidth = initSpecs.diam + initSpecs.tolerance
                outSpecs.holderCutouts.lowerWidth = initSpecs.diam * 2 + initSpecs.tolerance
                break;
            case 'rect2x2':
                outSpecs.holderCutouts.upperWidth = initSpecs.diam * 2 + initSpecs.tolerance
                outSpecs.holderCutouts.lowerWidth = initSpecs.diam * 2 + initSpecs.tolerance
                break;
            case 'rect2x3':
                outSpecs.holderCutouts.upperWidth = initSpecs.diam * 2 + initSpecs.tolerance
                outSpecs.holderCutouts.lowerWidth = initSpecs.diam * 2 + initSpecs.tolerance
                break;
            case 'hex':
                outSpecs.holderCutouts.upperWidth = initSpecs.diam * 2 + initSpecs.tolerance
                outSpecs.holderCutouts.upperEdgeWidth = initSpecs.diam * 3 + initSpecs.tolerance
                outSpecs.holderCutouts.lowerWidth = initSpecs.diam * 2 + initSpecs.tolerance
                outSpecs.holderCutouts.lowerEdgeWidth = initSpecs.diam * 3 + initSpecs.tolerance
                break;
            default:
                outSpecs.holderCutouts.upperWidth = initSpecs.diam + initSpecs.tolerance
                outSpecs.holderCutouts.lowerWidth = initSpecs.diam + initSpecs.tolerance
        }

        return outSpecs
    }

    const dowelJigBasePlate = (jigSpecs) => {
        return mesh3d.meshPanel({
            size: [
                2 * jigSpecs.sideMargin + jigSpecs.holderWidth,
                2 * jigSpecs.sideMargin + jigSpecs.holderDepth,
                jigSpecs.basePlateThickness,
            ],
            radius: jigSpecs.basePlateThickness,
            segments: 8,
            edgeMargin: jigSpecs.basePlateThickness,
            patternMode: 'fill'
        });
    }

    const dowelJigHolderBlanks = (jigSpecs) => {
        const regular = cuboid({
            size: [
                jigSpecs.holderWidth,
                jigSpecs.holderDepth,
                jigSpecs.holderHeight,
            ]
        });

        const compact = cuboid({
            size: [
                jigSpecs.holderWidth,
                jigSpecs.holderDepthCompact,
                jigSpecs.holderHeight,
            ]
        });

        return {
            regular,
            compact
        }
    }

    const dowelJigHolderCutouts = (jigSpecs) => {
        let upper = null;
        let lower = null;


        if (jigSpecs.pattern === 'hex') {
            const cutoutHeights = {
                base: jigSpecs.diam * jigSpecs.jigSideHeightFactor,
            }
            cutoutHeights.edge = jigSpecs.holderCutouts.height - cutoutHeights.base

            const upper1 = cuboid({
                size: [
                    jigSpecs.holderCutouts.upperWidth,
                    jigSpecs.holderCutouts.depth,
                    cutoutHeights.base,
                ]
            })
            const upper2 = cuboid({
                size: [
                    jigSpecs.holderCutouts.upperEdgeWidth,
                    jigSpecs.holderCutouts.depth,
                    cutoutHeights.edge,
                ]
            })
            upper = transform.stack([upper2, upper1])

            const lower1 = cuboid({
                size: [
                    jigSpecs.holderCutouts.lowerWidth,
                    jigSpecs.holderCutouts.depth,
                    cutoutHeights.base,
                ]
            })
            const lower2 = cuboid({
                size: [
                    jigSpecs.holderCutouts.lowerEdgeWidth,
                    jigSpecs.holderCutouts.depth,
                    cutoutHeights.edge,
                ]
            })
            lower = transform.stack([lower1, lower2])
        } else {
            upper = cuboid({
                size: [
                    jigSpecs.holderCutouts.upperWidth,
                    jigSpecs.holderCutouts.depth,
                    jigSpecs.holderCutouts.height,
                ]
            })
            lower = cuboid({
                size: [
                    jigSpecs.holderCutouts.lowerWidth,
                    jigSpecs.holderCutouts.depth,
                    jigSpecs.holderCutouts.height,
                ]
            })
        }

        return {
            upper,
            lower,
        };
    }

    const dowelJigHolders = (jigSpecs) => {
        const holders = dowelJigHolderBlanks(jigSpecs);
        const basePlate = dowelJigBasePlate(jigSpecs);
        const cutouts = dowelJigHolderCutouts(jigSpecs)

        const holderCoords = position.getGeomCoords(holders.regular)
        const upperAlignOpt = { modes: ['center', 'center', 'max'], relativeTo: [0, 0, holderCoords.top] }
        const lowerAlignOpt = { modes: ['center', 'center', 'min'], relativeTo: [0, 0, holderCoords.bottom] }

        const upper = union(
            align(upperAlignOpt, basePlate),
            align(upperAlignOpt, subtract(
                holders.regular,
                align(lowerAlignOpt, cutouts.upper)
            ))
        );

        const upperCompact = union(
            align(upperAlignOpt, basePlate),
            align(upperAlignOpt, subtract(
                holders.compact,
                align(lowerAlignOpt, cutouts.upper)
            ))
        );

        const lower = union(
            align(lowerAlignOpt, basePlate),
            align(lowerAlignOpt, subtract(
                holders.regular,
                align(upperAlignOpt, cutouts.lower)
            ))
        );

        const lowerCompact = union(
            align(lowerAlignOpt, basePlate),
            align(lowerAlignOpt, subtract(
                holders.compact,
                align(upperAlignOpt, cutouts.lower)
            ))
        );

        return {
            upper,
            upperCompact,
            lower,
            lowerCompact,
        };
    }

    const singleJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            radius: dowelRadius,
            diam: dowelDiam,
            dowelBundleHeight: dowelDiam,
            dowelBundleWidth: dowelDiam,
        }
        const jigSpecs = completeJigSpecs({ initSpecs });
        const jigHolders = dowelJigHolders(jigSpecs)

        return {
            jigHolders
        };
    }

    const triangularJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            radius: dowelRadius,
            diam: dowelDiam,
            pattern: 'tri',
            dowelBundleHeight: dowelDiam + (dowelDiam * EQUI_TRIANGLE_HEIGHT_FACTOR),
            dowelBundleWidth: dowelDiam * 2,
        }
        const jigSpecs = completeJigSpecs({ initSpecs });
        const jigHolders = dowelJigHolders(jigSpecs)

        return {
            jigHolders
        };
    }

    const twoByTwoJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            radius: dowelRadius,
            diam: dowelDiam,
            pattern: 'rect2x2',
            dowelBundleHeight: dowelDiam * 2,
            dowelBundleWidth: dowelDiam * 2,
        }
        const jigSpecs = completeJigSpecs({ initSpecs });
        const jigHolders = dowelJigHolders(jigSpecs)

        return {
            jigHolders
        };
    }

    const threeByTwoJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            radius: dowelRadius,
            diam: dowelDiam,
            pattern: 'rect3x2',
            dowelBundleHeight: dowelDiam * 2,
            dowelBundleWidth: dowelDiam * 3,
        }
        const jigSpecs = completeJigSpecs({ initSpecs });
        const jigHolders = dowelJigHolders(jigSpecs)

        return {
            jigHolders
        };
    }

    const hexagonalJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            radius: dowelRadius,
            diam: dowelDiam,
            pattern: 'hex',
            dowelBundleHeight: dowelDiam + (dowelDiam * EQUI_TRIANGLE_HEIGHT_FACTOR * 2),
            dowelBundleWidth: dowelDiam * 3,
        }
        const jigSpecs = completeJigSpecs({ initSpecs });
        const jigHolders = dowelJigHolders(jigSpecs)

        return {
            jigHolders
        };
    }

    const output = {
        singleJigs,
        triangularJigs,
        twoByTwoJigs,
        threeByTwoJigs,
        hexagonalJigs,
    }

    return output;
}

module.exports = { init: dowelJigs }

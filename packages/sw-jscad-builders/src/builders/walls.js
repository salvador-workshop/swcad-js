"use strict"

/**
 * ...
 * @namespace builders.walls
 */

const wallBuilder = ({ lib, swLib, swFamilies }) => {
    const { union, subtract } = lib.booleans
    const { align } = lib.transforms
    const { cuboid } = lib.primitives
    const { measureDimensions } = lib.measurements;

    const { mouldings } = swLib.models.prefab
    const { aranea } = swFamilies.trim
    const { PHI_INV } = swLib.core.constants

    const crownTrim = ({ totalThickness, totalLength, trimProfile }) => {
        const profileDims = measureDimensions(trimProfile);
        return mouldings.cuboidMoulding({ size: [totalLength, totalThickness, profileDims[1]] }, trimProfile);
    }

    const dadoTrim = ({ totalThickness, totalLength, trimProfile }) => {
        const profileDims = measureDimensions(trimProfile);
        return mouldings.cuboidMoulding({ size: [totalLength, totalThickness, profileDims[1]] }, trimProfile);
    }

    const baseTrim = ({ totalThickness, totalLength, trimProfile }) => {
        const profileDims = measureDimensions(trimProfile);
        return mouldings.cuboidMoulding({ size: [totalLength, totalThickness, profileDims[1]] }, trimProfile);
    }

    const getEntryTrimForDadoUnits = ({ dadoUnits, trimUnitHeight, trimUnitDepth }) => {
        const tFamilyAranea = aranea.buildTrimFamily({ unitHeight: trimUnitHeight, unitDepth: trimUnitDepth });
        let entryTrim = tFamilyAranea.crown.small;
        if (dadoUnits === 1) {
            entryTrim = tFamilyAranea.crown.medium;
        } else if (dadoUnits === 2) {
            entryTrim = tFamilyAranea.crown.large;
        }
        return entryTrim;
    }

    const verifyTrimUnits = ({ trimOpts, baseUnits, dadoUnits, crownUnits }) => {
        let bUnits = baseUnits || 0;
        let dUnits = dadoUnits || 0;
        let cUnits = crownUnits || 0;

        if (!trimOpts.includes('base')) {
            bUnits = 0;
        }
        if (!trimOpts.includes('dado')) {
            dUnits = 0;
        }
        if (!trimOpts.includes('crown')) {
            cUnits = 0;
        }

        return {
            baseUnits: bUnits,
            dadoUnits: dUnits,
            crownUnits: cUnits,
        }
    }

    return {
        getEntryTrimForDadoUnits,
        verifyTrimUnits,
        /**
         * Builds a wall.
         * @memberof builders.walls
         * @instance
         * @param {Object} opts 
         * @param {number} opts.length
         * @param {number} opts.thickness
         * @param {number} opts.height
         * @param {string[]} opts.trimOpts - ['base', 'dado', 'crown']
         * @param {string} opts.half  - 'upper' or 'lower'
         * @param {number} opts.crownUnits - Style level of crow trim. Expects integer between 0 to 2
         * @param {number} opts.dadoHeight - height of dado rail
         * @param {number} opts.dadoUnits - Style level of dado wall and trim. Expects integer between 0 to 2
         * @param {number} opts.baseUnits - Style level of base trim. Expects integer between 0 to 2
         * @param {number} opts.trimUnitHeight
         * @param {number} opts.trimUnitDepth
         * @param {string[]} opts.wallOpts 
         * @param {number} opts.trimSides - sides where trim is present. Expects integer between 1 to 4
         * @returns Wall geometry
        */
        buildWall: (opts) => {
            const {
                baseUnits,
                dadoUnits,
                crownUnits,
            } = verifyTrimUnits({
                trimOpts: opts.trimOpts,
                baseUnits: opts.baseUnits,
                dadoUnits: opts.dadoUnits,
                crownUnits: opts.crownUnits,
            })

            const baseWall = align({ modes: ['center', 'center', 'min'] }, cuboid({
                size: [opts.length, opts.thickness, opts.height],
            }));

            const tFamilyAranea = aranea.buildTrimFamily({ unitHeight: opts.trimUnitHeight, unitDepth: opts.trimUnitDepth });

            const dadoHt = opts.dadoHeight || opts.height * (1 - PHI_INV);
            // has to be adjusted or it clips through trimwork
            const dadoHtAdj = dadoHt - (opts.trimUnitHeight * (dadoUnits + 0.5))
            const dadoAdj = dadoUnits * 2 * opts.trimUnitDepth;
            const dadoWallSpecs = [dadoAdj + opts.length, dadoAdj + opts.thickness];
            const dadoWall = align({ modes: ['center', 'center', 'min'] }, cuboid({
                size: [dadoWallSpecs[0], dadoWallSpecs[1], dadoHtAdj],
            }));

            let wallWithTrim = baseWall;


            if (opts.trimOpts.includes('base') && opts.half != 'upper') {
                let baseProfile = tFamilyAranea.base.small;
                if (baseUnits === 1) {
                    baseProfile = tFamilyAranea.base.medium;
                } else if (baseUnits === 2) {
                    baseProfile = tFamilyAranea.base.large;
                }

                const baseAdj = (dadoUnits + baseUnits + 1) * 2 * opts.trimUnitDepth;
                const baseTrimSpecs = [baseAdj + opts.length, baseAdj + opts.thickness];
                const bTrim = align({ modes: ['center', 'center', 'min'] }, baseTrim({
                    totalLength: baseTrimSpecs[0],
                    totalThickness: baseTrimSpecs[1],
                    trimProfile: baseProfile,
                }));

                wallWithTrim = union(wallWithTrim, bTrim);
            }

            if (opts.trimOpts.includes('dado') && opts.half != 'upper') {
                wallWithTrim = union(wallWithTrim, dadoWall);

                let dadoProfile = tFamilyAranea.dado.small;
                if (dadoUnits === 1) {
                    dadoProfile = tFamilyAranea.dado.medium;
                } else if (dadoUnits === 2) {
                    dadoProfile = tFamilyAranea.dado.large;
                }
                const dadoTrimSpecs = [dadoWallSpecs[0] + opts.trimUnitDepth, dadoWallSpecs[1] + opts.trimUnitDepth];
                const dTrim = align({ modes: ['center', 'center', 'max'], relativeTo: [0, 0, dadoHt] }, dadoTrim({
                    totalLength: dadoTrimSpecs[0],
                    totalThickness: dadoTrimSpecs[1],
                    trimProfile: dadoProfile,
                }));
                wallWithTrim = union(wallWithTrim, dTrim);
            }

            if (opts.trimOpts.includes('crown') && opts.half != 'lower') {
                let crownProfile = tFamilyAranea.crown.small;
                if (crownUnits === 1) {
                    crownProfile = tFamilyAranea.crown.medium;
                } else if (crownUnits === 2) {
                    crownProfile = tFamilyAranea.crown.large;
                }

                const crownAdj = (crownUnits + 1) * 2 * opts.trimUnitDepth;
                const crownTrimSpecs = [crownAdj + opts.length, crownAdj + opts.thickness];
                const cTrim = align({ modes: ['center', 'center', 'max'], relativeTo: [0, 0, opts.height] }, crownTrim({
                    totalLength: crownTrimSpecs[0],
                    totalThickness: crownTrimSpecs[1],
                    trimProfile: crownProfile,
                }));
                wallWithTrim = union(wallWithTrim, cTrim);
            }

            const wallDim = measureDimensions(baseWall);
            const cutBoxSpecs = [wallDim[0] * 2, wallDim[1] * 2, wallDim[2] * 1.25]
            if (opts.half === 'upper') {
                const cutBox = align({ modes: ['center', 'center', 'max'], relativeTo: [0, 0, dadoHt] }, cuboid({ size: cutBoxSpecs }));
                wallWithTrim = subtract(wallWithTrim, cutBox);
            } else if (opts.half === 'lower') {
                const cutBox = align({ modes: ['center', 'center', 'min'], relativeTo: [0, 0, dadoHt] }, cuboid({ size: cutBoxSpecs }));
                wallWithTrim = subtract(wallWithTrim, cutBox);
            }


            return wallWithTrim;
        }
    };
}

module.exports = { init: wallBuilder }

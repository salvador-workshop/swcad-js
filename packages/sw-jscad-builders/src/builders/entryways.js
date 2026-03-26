"use strict"

/**
 * ...
 * @namespace builders.entryways
 */

const entrywayBuilder = ({ lib, swLib }) => {
    const { union, subtract, intersect } = lib.booleans;
    const { translate, rotate, mirror } = lib.transforms;
    const { cuboid } = lib.primitives;
    const { measureDimensions } = lib.measurements;
    const { extrudeLinear } = lib.extrusions
    const { hull } = lib.hulls

    const {
        arches,
        walls,
    } = swLib.builders

    return {
        /**
         * Builds a gothic entryway.
         * @memberof builders.entryways
         * @instance
         * @param {Object} opts 
         * @param {number} opts.wallLength
         * @param {number} opts.wallThickness
         * @param {number} opts.wallHeight
         * @param {number} opts.entryLength
         * @param {number} opts.trimUnitHeight
         * @param {number} opts.trimUnitDepth
         * @param {number} opts.crownUnits
         * @param {number} opts.dadoHeight
         * @param {number} opts.dadoUnits
         * @param {number} opts.baseUnits
         * @param {number} opts.wallOpts
         * @param {number} opts.trimSides
         * @param {string[]} opts.trimOpts - ['base', 'dado', 'crown']
         * @param {string[]} opts.entryOpts 
         * @param {number} opts.archRadFactor - arch radius factor
         * @returns Entryway geometry
         */
        buildGothicEntryway: (opts) => {
            const wallSpace = opts.wallLength - opts.entryLength;

            const wall1Specs = [wallSpace / 2, opts.wallThickness, opts.wallHeight];
            const wall2Specs = [wallSpace / 2, opts.wallThickness, opts.wallHeight];
            const topWallSpecs = [opts.wallLength, opts.wallThickness, opts.wallHeight];

            const trimUnits = walls.verifyTrimUnits({
                trimOpts: opts.trimOpts,
                baseUnits: opts.baseUnits,
                dadoUnits: opts.dadoUnits,
                crownUnits: opts.crownUnits,
            })

            const wall1 = walls.buildWall({
                height: wall1Specs[2],
                thickness: wall1Specs[1],
                length: wall1Specs[0],
                // wallOpts: 0,
                half: 'lower',
                trimOpts: opts.trimOpts,
                baseUnits: trimUnits.baseUnits,
                dadoUnits: trimUnits.dadoUnits,
                crownUnits: trimUnits.crownUnits,
                dadoHeight: opts.dadoHeight,
                trimUnitHeight: opts.trimUnitHeight,
                trimUnitDepth: opts.trimUnitDepth,
            });
            const wall1Dims = measureDimensions(wall1);

            const wall2 = walls.buildWall({
                height: wall2Specs[2],
                thickness: wall2Specs[1],
                length: wall2Specs[0],
                half: 'lower',
                trimOpts: opts.trimOpts,
                baseUnits: trimUnits.baseUnits,
                dadoUnits: trimUnits.dadoUnits,
                crownUnits: trimUnits.crownUnits,
                dadoHeight: opts.dadoHeight,
                trimUnitHeight: opts.trimUnitHeight,
                trimUnitDepth: opts.trimUnitDepth,
            });

            const topWall = walls.buildWall({
                height: topWallSpecs[2],
                thickness: topWallSpecs[1],
                length: topWallSpecs[0],
                half: 'upper',
                trimOpts: opts.trimOpts,
                baseUnits: trimUnits.baseUnits,
                dadoUnits: trimUnits.dadoUnits,
                crownUnits: trimUnits.crownUnits,
                dadoHeight: opts.dadoHeight,
                trimUnitHeight: opts.trimUnitHeight,
                trimUnitDepth: opts.trimUnitDepth,
            });

            let archTrimProfile = walls.getEntryTrimForDadoUnits({
                dadoUnits: trimUnits.dadoUnits,
                trimUnitHeight: opts.trimUnitHeight,
                trimUnitDepth: opts.trimUnitDepth,
            });
            archTrimProfile = rotate([0, 0, Math.PI * 1.5], archTrimProfile);
            const archTrimProfileSpecs = measureDimensions(archTrimProfile);
            const archRadFactor = opts.archRadFactor || 0.75;
            const thinWallThickness = opts.wallThickness - (archTrimProfileSpecs[1] * 2);

            const trimArch = arches.twoPtArch({ arcRadius: opts.entryLength * archRadFactor, archWidth: opts.entryLength, profileWidth: 5 }, archTrimProfile);
            const adjTrimArch = translate([0, (thinWallThickness + archTrimProfileSpecs[1]) / 2, wall1Dims[2]], trimArch);
            const adjTrimArchOpp = mirror({ normal: [0, 1, 0] }, adjTrimArch);
            const trimArchDims = measureDimensions(trimArch);

            const innerOpeningSpecs = [opts.entryLength, 5 * opts.wallThickness, null];
            const innerOpeningProfile = arches.twoPtArch({ arcRadius: innerOpeningSpecs[0] * archRadFactor, archWidth: innerOpeningSpecs[0] });
            const innerOpening = rotate([Math.PI / 2, 0, 0], extrudeLinear({ height: innerOpeningSpecs[1] }, innerOpeningProfile));
            const adjInnerOpening = translate([0, innerOpeningSpecs[1] / 2, wall1Dims[2]], innerOpening);

            const trimOpeningSpecs = [
                archTrimProfileSpecs[0] * 2 + opts.entryLength,
                4 * opts.wallThickness,
                wall1Dims[2] + trimArchDims[2]
            ];
            const trimOpening = hull([
                translate([0, trimOpeningSpecs[1] / -2, 0], adjTrimArch),
                translate([0, trimOpeningSpecs[1] / 2, 0], adjTrimArch),
            ]);
            const adjTrimOpening = translate([0, 0, 0], trimOpening);
            const thinWall = intersect(
                translate([0, 0, opts.wallHeight / 2], cuboid({
                    size: [
                        opts.wallLength,
                        thinWallThickness,
                        opts.wallHeight,
                    ]
                })),
                topWall,
            );

            let punchedTopWall = subtract(topWall, adjInnerOpening);
            if (opts.trimOpts.includes('dado')) {
                punchedTopWall = subtract(punchedTopWall, adjTrimOpening);
                punchedTopWall = union(punchedTopWall, thinWall);
                punchedTopWall = subtract(punchedTopWall, adjInnerOpening);
            }

            const wallAdj = wallSpace / 4 + (opts.entryLength / 2)
            const trimArches = union(
                adjTrimArch,
                adjTrimArchOpp,
            )
            const entryway = union(
                translate([-wallAdj, 0, 0], wall1),
                translate([wallAdj, 0, 0], wall2),
                translate([0, 0, 0], punchedTopWall),
            );

            return union(entryway, trimArches);
        }
    };
}

module.exports = { init: entrywayBuilder }

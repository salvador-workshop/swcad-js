const connectionsInit = ({ jscad, swcadJs }) => {
    const { circle, rectangle, triangle, cuboid, cylinder } = jscad.primitives
    const { union, subtract, scission } = jscad.booleans
    const { align, translate, mirror } = jscad.transforms
    const { hull, hullChain } = jscad.hulls
    const { degToRad } = jscad.utils
    const { project } = jscad.extrusions


    const { position, math } = swcadJs.calcs

    //---------------
    //  CONNECTIONS
    //---------------

    const connectionDefaults = {
        interfaceThickness: 1.333333,
        tolerance: math.inchesToMm(1 / 128),
        fit: math.inchesToMm(1 / 128),
        cornerRadius: math.inchesToMm(1 / 4),
        dovetailAngle: degToRad(8),
        dovetailMargin: 1,
        tabAngle: degToRad(8),
        tabMargin: 1,
    }

    const createConnTrapezoid = ({ depth, width, angle, reverse = false }) => {
        const baseRect = rectangle({ size: [depth, width] })
        const baseRectCoords = position.getGeomCoords(baseRect)
        const triOpts = position.triangle.rightTriangleOpts({ long: depth, longAngle: angle })
        const triangleEnds = [
            align(
                { modes: ['center', 'max', 'center'], relativeTo: [0, baseRectCoords.back, 0] },
                mirror({ normal: [0, 1, 0] }, triangle(triOpts))
            ),
            align(
                { modes: ['center', 'min', 'center'], relativeTo: [0, baseRectCoords.front, 0] },
                triangle(triOpts)
            ),
        ]

        const outShape = subtract(baseRect, triangleEnds)

        if (reverse) {
            return mirror({ normal: [1, 0, 0] }, outShape)
        }
        return outShape
    }

    const interlockingProfiles = (
        unitWidth,
        unitLength,
        fitGap,
    ) => {
        console.log('interlockingProfiles()', unitWidth, unitLength, fitGap)
        const sampleThickness = 1 // scission only works with 3D objects. Need a filler thickness for now
        const widthUnit = unitWidth / 3
        const lengthUnit = unitLength / 3

        const dovetailEndSize = [
            lengthUnit / 6,
            lengthUnit,
        ]

        const widthCoords = [
            widthUnit,
            widthUnit * 2,
        ]
        const lengthCoords = [
            lengthUnit,
            lengthUnit * 2,
        ]

        const dovetailPanelMidpoint = [
            unitWidth / 2,
            unitLength / 2,
        ]

        const baseProfilePanel = cuboid({
            size: [unitWidth, unitLength, sampleThickness],
            center: [dovetailPanelMidpoint[0], dovetailPanelMidpoint[1], 0]
        })

        const lowerPts = [
            [0, lengthCoords[0]],
            [widthCoords[0], lengthCoords[0]],
            [widthCoords[1], lengthCoords[0]],
            [unitWidth, lengthCoords[0]],
        ]

        const upperPts = [
            [widthCoords[0] - dovetailEndSize[0], lengthCoords[1]],
            [widthCoords[1] + dovetailEndSize[0], lengthCoords[1]],
        ]

        const allPts = [
            lowerPts[0],
            lowerPts[1],
            ...upperPts,
            lowerPts[2],
            lowerPts[3],
        ]

        let dovetailCutPoints = allPts.map(dtPt => {
            return cylinder({
                radius: fitGap / 2,
                height: sampleThickness * 10,
                center: [dtPt[0], dtPt[1], 0],
            })
        })

        let dovetailCut = hullChain(dovetailCutPoints)

        const cutPanel = subtract(
            baseProfilePanel,
            dovetailCut
        )

        const cutParts = scission(cutPanel)
        const dTailProfiles = [
            align({ modes: ['center', 'center', 'center'] }, cutParts[1]),
            align({ modes: ['center', 'center', 'center'] }, cutParts[0]),
        ]

        return [
            project({}, dTailProfiles[0]),
            project({}, dTailProfiles[1]),
        ]
    }

    /**
     * Connection profiles
     * @memberof profiles
     * @namespace connections
     */
    const connections = {
        /**
         * ...
         * @memberof profiles.connections
         * @param {object} opts 
         * @returns ...
         */
        pegboard: ({
            spacing,
            radius,
            margin,
            cornerRadius = connectionDefaults.cornerRadius,
            fit = connectionDefaults.fit,
            tolerance = connectionDefaults.tolerance
        }) => {
            const diametre = radius * 2
            const totalGap = fit / 4 + (tolerance / 4)
            const specs = {
                ...connectionDefaults,
                diametre,
                fitDowelRadius: -totalGap + radius,
                fitHoleRadius: totalGap + radius,
                margin: margin || radius,
            }
            specs.totalWidth = specs.margin * 2 + (radius * 2 + spacing)
            const halfWidth = specs.totalWidth / 2
            specs.cornerPoints = [
                [halfWidth - cornerRadius, halfWidth - cornerRadius, 0],
                [-halfWidth + cornerRadius, halfWidth - cornerRadius, 0],
                [-halfWidth + cornerRadius, -halfWidth + cornerRadius, 0],
                [halfWidth - cornerRadius, -halfWidth + cornerRadius, 0],
            ]
            const halfUnit = spacing / 2
            specs.dowelPoints = [
                [halfUnit, halfUnit, 0],
                [-halfUnit, halfUnit, 0],
                [-halfUnit, -halfUnit, 0],
                [halfUnit, -halfUnit, 0],
            ]

            const corners = specs.cornerPoints.map(cPt => {
                return translate(cPt, circle({ radius: cornerRadius }))
            })
            const dowels = specs.dowelPoints.map(dPt => {
                return translate(dPt, circle({ radius: specs.fitDowelRadius }))
            })
            const dowelDies = specs.dowelPoints.map(dPt => {
                return translate(dPt, circle({ radius: specs.fitHoleRadius }))
            })

            const basePlate = hull(corners)
            const dowelAssembly = union(dowels)

            const male = dowelAssembly
            const female = subtract(basePlate, dowelDies)

            return {
                male,
                female,
                size: [specs.totalWidth, specs.totalWidth],
            }
        },
        /**
         * ...
         * @memberof profiles.connections
         * @param {object} opts
         * @returns ...
         */
        polygon: ({
            radius,
            segments,
            margin,
            cornerRadius = connectionDefaults.cornerRadius,
            fit = connectionDefaults.fit,
            tolerance = connectionDefaults.tolerance
        }) => {
            const diametre = radius * 2
            const totalGap = fit / 4 + (tolerance / 4)
            const specs = {
                ...connectionDefaults,
                diametre,
                fitDowelRadius: -totalGap + radius,
                fitHoleRadius: totalGap + radius,
                margin: margin || radius,
            }
            specs.totalWidth = specs.margin * 2 + specs.diametre
            const halfWidth = specs.totalWidth / 2
            specs.cornerPoints = [
                [halfWidth - cornerRadius, halfWidth - cornerRadius, 0],
                [-halfWidth + cornerRadius, halfWidth - cornerRadius, 0],
                [-halfWidth + cornerRadius, -halfWidth + cornerRadius, 0],
                [halfWidth - cornerRadius, -halfWidth + cornerRadius, 0],
            ]

            const dowel = circle({ radius: specs.fitDowelRadius, segments })
            const dowelDie = circle({ radius: specs.fitHoleRadius, segments })

            const corners = specs.cornerPoints.map(cPt => {
                return translate(cPt, circle({ radius: cornerRadius }))
            })
            const basePlate = hull(corners)

            const male = dowel
            const female = subtract(basePlate, dowelDie)

            return {
                male,
                female,
                size: [specs.totalWidth, specs.totalWidth],
            }
        },
        /**
         * Tab and Dovetail profiles are designed to fit right against the male edge.
         * With a margin (1mm default) extending into the female edge to ensure one shape that holds both dovetail ends.
         * @memberof profiles.connections
         * @param {*} opts 
         * @returns ...
         */
        tab: ({
            width,
            depth,
            margin = connectionDefaults.tabMargin,
            angle = connectionDefaults.tabAngle,
            fit = connectionDefaults.fit,
            tolerance = connectionDefaults.tolerance
        }) => {
            const specs = {
                ...connectionDefaults,
                totalWidth: margin * 2 + width,
                totalTabDepth: margin + depth,
            }

            const baseRect = rectangle({ size: [specs.totalTabDepth, specs.totalWidth] })
            const baseRectCoords = position.getGeomCoords(baseRect)

            const male = align(
                { modes: ['max', 'center', 'center'], relativeTo: [baseRectCoords.right, 0, 0] },
                createConnTrapezoid({ depth, width, angle })
            )
            const female = align(
                { modes: ['min', 'center', 'center'], relativeTo: [baseRectCoords.left, 0, 0] },
                subtract(baseRect, male)
            )

            return {
                male,
                female,
                size: [specs.totalTabDepth, specs.totalWidth],
            }
        },
        /**
         * Tab and Dovetail profiles are designed to fit right against the male edge.
         * @memberof profiles.connections
         * @param {*} opts 
         * @returns ...
         */
        dovetail: ({
            width,
            depth,
            fitGap = connectionDefaults.fit,
        }) => {
            console.log('dovetail()', width, depth, fitGap)
            const dovetailProfiles = interlockingProfiles(width, depth, fitGap)

            return {
                male: dovetailProfiles[1],
                female: dovetailProfiles[0],
                size: [width, depth],
            }
        },
    }

    return connections;
}

module.exports = { init: connectionsInit }
"use strict"

/**
 * ...
 * @namespace layout
 */

const layoutUtils = ({ lib, swLib }) => {
    const { cuboid, rectangle } = lib.primitives;
    const { union, subtract } = lib.booleans;
    const { translate, align } = lib.transforms;
    const { measureDimensions } = lib.measurements;
    const isGeom2 = lib.geometries.geom2.isA
    const isPath2 = lib.geometries.path2.isA

    const { maths } = swLib.core
    const { text2d } = swLib.models.profiles
    const { text3d } = swLib.models.prefab

    const layoutElements = new Map();
    let largestDimensionX = 0;
    let largestDimensionY = 0;
    let sortedLayoutEntries = [];

    const largestDimension = () => {
        return [largestDimensionX, largestDimensionY];
    }
    const getXYArea = (dims) => {
        return dims[0] * dims[1];
    }

    /**
    * Comparator function for Array.sort()
    * @param {number[]} firstEntry - [x,y,z] of first geometry
    * @param {number[]} secondEntry - [x,y,z] of second geometry
    */
    const dimsSizeAsc = (firstEntry, secondEntry) => {
        const firstArea = getXYArea(firstEntry.layoutDims)
        const secondArea = getXYArea(secondEntry.layoutDims)
        if (firstArea.size > secondArea.size) {
            return 1;
        } else if (firstArea.size < secondArea.size) {
            return -1;
        } else {
            return 0;
        }
    }

    const addLayoutEntry = ({ layoutEntry }) => {
        layoutElements.set(layoutEntry.id, layoutEntry);
        const newEntries = [...sortedLayoutEntries, layoutEntry];
        sortedLayoutEntries = newEntries.sort(dimsSizeAsc);

        if (layoutEntry.layoutDims[0] > largestDimensionX) {
            largestDimensionX = layoutEntry.layoutDims[0];
        }
        if (layoutEntry.layoutDims[1] > largestDimensionY) {
            largestDimensionY = layoutEntry.layoutDims[1];
        }
    }

    const layoutFrame = ({
        title,
        subtitle = '. . .',
        data1 = '..',
        data2 = '....',
        objectDims,
        layoutDims,
        is2D = false,
    }) => {
        const frameWidth = 1.5;
        const frameOpts = {}

        const ctrlPts = {
            topLeft: [layoutDims[0] / -2, layoutDims[1] / 2],
            topRight: [layoutDims[0] / 2, layoutDims[1] / 2],
            bottomLeft: [layoutDims[0] / -2, layoutDims[1] / -2],
            bottomRight: [layoutDims[0] / 2, layoutDims[1] / -2],
        }
        const alignmentSlots = {
            topLeft: { modes: ['min', 'max', 'min'], relativeTo: [...ctrlPts.topLeft, 0] },
            topRight: { modes: ['max', 'max', 'min'], relativeTo: [...ctrlPts.topRight, 0] },
            bottomLeft: { modes: ['min', 'min', 'min'], relativeTo: [...ctrlPts.bottomLeft, 0] },
            bottomRight: { modes: ['max', 'min', 'min'], relativeTo: [...ctrlPts.bottomRight, 0] },
        }

        if (is2D) {
            // 2D Frame

            const titleText = text2d.basicText({
                message: title,
                fontSize: 3.5,
                charLineWidth: 1,
                ...frameOpts,
            });

            const subtitleText = text2d.basicText({
                message: subtitle,
                fontSize: 3,
                charLineWidth: 0.75,
                ...frameOpts,
            });;

            const data1Text = text2d.basicText({
                message: data1,
                fontSize: 3,
                charLineWidth: 0.75,
                ...frameOpts,
            });;

            const data2Text = text2d.basicText({
                message: data2,
                fontSize: 3,
                charLineWidth: 0.75,
                ...frameOpts,
            });;

            const frameSpacer = frameWidth * 1.25;
            const basicFrame = subtract(
                rectangle({
                    size: [
                        layoutDims[0] + frameSpacer + (frameWidth * 2),
                        layoutDims[1] + frameSpacer + (frameWidth * 2)
                    ]
                }),
                rectangle({
                    size: [
                        layoutDims[0] + frameSpacer,
                        layoutDims[1] + frameSpacer
                    ]
                })
            );

            return union(
                align({ modes: ['center', 'center', 'min'] }, basicFrame),
                align(alignmentSlots.topLeft, data1Text),
                align(alignmentSlots.topRight, data2Text),
                align(alignmentSlots.bottomLeft, titleText),
                align(alignmentSlots.bottomRight, subtitleText),
            );
        }

        // 3D Frame
        const recessDepth = 0.6667;
        frameOpts.extrudeHeight = recessDepth;
        frameOpts.panelThickness = frameWidth + recessDepth;
        frameOpts.panelOffset = (frameWidth + recessDepth) * 2;

        const titleText = text3d.textPanel({
            message: title,
            fontSize: 3.5,
            charLineWidth: 1,
            ...frameOpts,
        });

        const subtitleText = text3d.textPanel({
            message: subtitle,
            fontSize: 3,
            charLineWidth: 0.75,
            ...frameOpts,
        });

        const data1Text = text3d.textPanel({
            message: data1,
            fontSize: 3,
            charLineWidth: 0.75,
            ...frameOpts,
        });

        const data2Text = text3d.textPanel({
            message: data2,
            fontSize: 3,
            charLineWidth: 0.75,
            ...frameOpts,
        });

        const basicFrame = subtract(
            cuboid({ size: [layoutDims[0], layoutDims[1], frameWidth] }),
            cuboid({ size: [layoutDims[0] - (frameWidth * 2), layoutDims[1] - (frameWidth * 2), 3] }),
        );

        return union(
            align({ modes: ['center', 'center', 'min'] }, basicFrame),
            align(alignmentSlots.topLeft, data1Text),
            align(alignmentSlots.topRight, data2Text),
            align(alignmentSlots.bottomLeft, titleText),
            align(alignmentSlots.bottomRight, subtitleText),
        );
    }

    const linearLayout = ({ layoutOpts }) => {
        const layoutContent = [];

        layoutElements.values().forEach((val, idx) => {
            const offsets = { x: 0, y: 0, z: 0 };
            if (layoutOpts.relativeTo) {
                offsets.x = offsets.x + layoutOpts.relativeTo[0];
                offsets.y = offsets.y + layoutOpts.relativeTo[1];
                offsets.z = offsets.z + layoutOpts.relativeTo[2];
            }

            const gridUnits = [
                largestDimension()[0] + layoutOpts.layoutSpace,
                largestDimension()[1] + layoutOpts.layoutSpace,
            ]

            let layoutPosition = [
                gridUnits[0] * idx + offsets.x,
                offsets.y,
                offsets.z
            ];
            if (layoutOpts.column) {
                layoutPosition = [
                    offsets.x,
                    gridUnits[1] * idx + offsets.y,
                    offsets.z
                ];
            }

            const nextLayoutGeoms = [
                translate(layoutPosition, val.geom),
            ]

            const skipFrame = layoutOpts.noFrame || val.tags.includes('noFrame');
            const is2D = val.tags.includes('is2D');

            if (!skipFrame) {
                const frameGeom = translate(layoutPosition, layoutFrame({
                    title: val.name,
                    subtitle: val.desc,
                    objectDims: val.objectDims,
                    layoutDims: val.layoutDims,
                    is2D,
                }));
                nextLayoutGeoms.push(frameGeom)
            }
            layoutContent.push(...nextLayoutGeoms)
        })

        return layoutContent;
    }

    const gridLayout = ({ layoutOpts }) => {
        const gridSize = maths.factorize(layoutElements.size);
        const numColumns = gridSize[1];
        const layoutContent = [];

        let gridRow = -1;
        layoutElements.values().forEach((val, idx) => {
            const gridCol = idx % numColumns
            if (gridCol === 0) {
                gridRow += 1;
            }
            const gridPos = { row: gridRow, col: gridCol };

            const offsets = { x: 0, y: 0, z: 0 };
            if (layoutOpts.relativeTo) {
                offsets.x = offsets.x + layoutOpts.relativeTo[0];
                offsets.y = offsets.y + layoutOpts.relativeTo[1];
                offsets.z = offsets.z + layoutOpts.relativeTo[2];
            }

            const gridUnits = [
                largestDimension()[0] + layoutOpts.layoutSpace,
                largestDimension()[1] + layoutOpts.layoutSpace,
            ]

            let layoutPosition = [
                gridUnits[0] * gridPos.col + offsets.x,
                gridUnits[1] * gridPos.row + offsets.y,
                offsets.z
            ];

            const nextLayoutGeoms = [
                translate(layoutPosition, val.geom),
            ]
            const skipFrame = layoutOpts.noFrame || val.tags.includes('noFrame');
            const is2D = val.tags.includes('is2D');
            if (!skipFrame) {
                const frameGeom = translate(layoutPosition, layoutFrame({
                    title: val.name,
                    subtitle: val.desc,
                    objectDims: val.objectDims,
                    layoutDims: val.layoutDims,
                    is2D,
                }));
                nextLayoutGeoms.push(frameGeom)
            }
            layoutContent.push(...nextLayoutGeoms)
        })

        return layoutContent;
    }

    return {
        /**
         * Adds element to layout
         * @memberof layout
         * @instance
         * @param {Object} opts 
         * @param {string} opts.name 
         * @param {string} opts.desc 
         * @param {string[]} opts.tags 
         * @param {Object} opts.layoutOpts 
         * @param {number[]} opts.layoutOpts.minSize -- [x,y,z] showing minimum size for element layout
         * @param {boolean} opts.layoutOpts.is2D -- 
         * @param {Object} geom
         */
        addToLayout: ({
            name = '',
            desc = '',
            tags = [],
            layoutOpts = {},
        }, geom) => {
            const layoutId = name + '-randomTag';
            const objectDims = measureDimensions(geom);
            const layoutMargin = layoutOpts.layoutMargin || 10;
            const layoutDims = [
                layoutMargin * 2 + objectDims[0],
                layoutMargin * 2 + objectDims[1],
                layoutMargin * 2 + objectDims[2],
            ];
            const extraTags = [
                isGeom2(geom) || isPath2(geom) ? 'is2D' : 'is3D'
            ]
            const layoutEntry = {
                id: layoutId,
                name,
                desc,
                tags: [...tags, ...extraTags],
                geom: align({ modes: ['center', 'center', 'min'] }, geom),
                objectDims,
                layoutDims,
            }
            addLayoutEntry({ layoutEntry });

            return layoutEntry;
        },
        removeFromLayout: ({ id }) => {
            layoutElements.delete(id);
        },
        clearLayout: () => {
            layoutElements.clear();
        },
        linearLayout,
        gridLayout,
    }
}

module.exports = { init: layoutUtils };

"use strict"

const inchesToMm = (numIn) => numIn * 25.4

/**
 * Masonry standards
 * @namespace masonry
 * @memberof data.standards
 */
const masonryStd = ({ jscad }) => {

    const masonry = {
        MORTAR_JOINT: inchesToMm(3 / 8),
        MORTAR_JOINT_LG: inchesToMm(1 / 2),
    }

    /**
     * Brick standards
     * @memberof data.standards.masonry
     */
    const brick = {
        US_BRICK_LENGTH_NOM: inchesToMm(8),
        US_BRICK_WIDTH_NOM: inchesToMm(4),
        US_BRICK_HEIGHT_NOM: inchesToMm(2 + (2 / 3)),
        UK_BRICK_LENGTH_NOM: 215,
        UK_BRICK_WIDTH_NOM: 102.5,
        UK_BRICK_HEIGHT_NOM: 65,
    }

    brick['US_BRICK_LENGTH'] = brick.US_BRICK_LENGTH_NOM - masonry.MORTAR_JOINT
    brick['US_BRICK_WIDTH'] = brick.US_BRICK_WIDTH_NOM - masonry.MORTAR_JOINT
    brick['US_BRICK_HEIGHT'] = brick.US_BRICK_HEIGHT_NOM - masonry.MORTAR_JOINT
    brick['US_BRICK_LENGTH_LG_JOINT'] = brick.US_BRICK_LENGTH_NOM - masonry.MORTAR_JOINT_LG
    brick['US_BRICK_WIDTH_LG_JOINT'] = brick.US_BRICK_WIDTH_NOM - masonry.MORTAR_JOINT_LG
    brick['US_BRICK_HEIGHT_LG_JOINT'] = brick.US_BRICK_HEIGHT_NOM - masonry.MORTAR_JOINT_LG

    /**
     * Concrete standards
     * @memberof data.standards.masonry
     */
    const concrete = {
        CMU_FACE_THICKNESS: 36,
        CMU_WEB_THICKNESS: 32,
        CMU_WEB_THICKNESS_SM: 26,
        CMU_4_NOM: [inchesToMm(16), inchesToMm(4), inchesToMm(8)],
        CMU_6_NOM: [inchesToMm(16), inchesToMm(6), inchesToMm(8)],
        CMU_8_NOM: [inchesToMm(16), inchesToMm(8), inchesToMm(8)],
        CMU_10_NOM: [inchesToMm(16), inchesToMm(10), inchesToMm(8)],
        CMU_12_NOM: [inchesToMm(16), inchesToMm(12), inchesToMm(8)],
        CMU_4HALF_NOM: [inchesToMm(8), inchesToMm(4), inchesToMm(8)],
        CMU_6HALF_NOM: [inchesToMm(8), inchesToMm(6), inchesToMm(8)],
        CMU_8HALF_NOM: [inchesToMm(8), inchesToMm(8), inchesToMm(8)],
        CMU_10HALF_NOM: [inchesToMm(8), inchesToMm(10), inchesToMm(8)],
        CMU_12HALF_NOM: [inchesToMm(8), inchesToMm(12), inchesToMm(8)],
    }

    Object.entries(concrete).forEach(([concKey, concVal]) => {
        if (concKey.includes('_NOM')) {
            const newKey = concKey.replace('_NOM', '')
            concrete[newKey] = [
                concVal[0] - masonry.MORTAR_JOINT,
                concVal[1] - masonry.MORTAR_JOINT,
                concVal[2] - masonry.MORTAR_JOINT,
            ]
            concrete[`${newKey}_LG_JOINT`] = [
                concVal[0] - masonry.MORTAR_JOINT_LG,
                concVal[1] - masonry.MORTAR_JOINT_LG,
                concVal[2] - masonry.MORTAR_JOINT_LG,
            ]
        }
    });

    return {
        ...masonry,
        brick,
        concrete,
    }
}

module.exports = { init: masonryStd };

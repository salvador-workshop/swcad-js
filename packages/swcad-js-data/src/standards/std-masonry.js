"use strict"

const inchesToMm = (numIn) => numIn * 25.4

const masonryStd = ({ jscad }) => {

    const masonryCore = {
        MORTAR_JOINT: inchesToMm(3 / 8),
        MORTAR_JOINT_LG: inchesToMm(1 / 2),
    }

    /**
     * Brick standards
     * @namespace brick
     * @memberof data.standards.masonry
     */
    const brick = {
        /**
         * Us_Brick_Length_Nom
         * @memberof data.standards.masonry.brick
         */
        US_BRICK_LENGTH_NOM: inchesToMm(8),
        /**
         * Us_Brick_Width_Nom
         * @memberof data.standards.masonry.brick
         */
        US_BRICK_WIDTH_NOM: inchesToMm(4),
        /**
         * Us_Brick_Height_Nom
         * @memberof data.standards.masonry.brick
         */
        US_BRICK_HEIGHT_NOM: inchesToMm(2 + (2 / 3)),
        /**
         * Uk_Brick_Length_Nom
         * @memberof data.standards.masonry.brick
         */
        UK_BRICK_LENGTH_NOM: 215,
        /**
         * Uk_Brick_Width_Nom
         * @memberof data.standards.masonry.brick
         */
        UK_BRICK_WIDTH_NOM: 102.5,
        /**
         * Uk_Brick_Height_Nom
         * @memberof data.standards.masonry.brick
         */
        UK_BRICK_HEIGHT_NOM: 65,
    }

    brick['US_BRICK_LENGTH'] = brick.US_BRICK_LENGTH_NOM - masonryCore.MORTAR_JOINT
    brick['US_BRICK_WIDTH'] = brick.US_BRICK_WIDTH_NOM - masonryCore.MORTAR_JOINT
    brick['US_BRICK_HEIGHT'] = brick.US_BRICK_HEIGHT_NOM - masonryCore.MORTAR_JOINT
    brick['US_BRICK_LENGTH_LG_JOINT'] = brick.US_BRICK_LENGTH_NOM - masonryCore.MORTAR_JOINT_LG
    brick['US_BRICK_WIDTH_LG_JOINT'] = brick.US_BRICK_WIDTH_NOM - masonryCore.MORTAR_JOINT_LG
    brick['US_BRICK_HEIGHT_LG_JOINT'] = brick.US_BRICK_HEIGHT_NOM - masonryCore.MORTAR_JOINT_LG

    /**
     * Concrete standards
     * @namespace concrete
     * @memberof data.standards.masonry
     */
    const concrete = {
        /**
         * Cmu_Face_Thickness
         * @memberof data.standards.masonry.concrete
         */
        CMU_FACE_THICKNESS: 36,
        /**
         * Cmu_Web_Thickness
         * @memberof data.standards.masonry.concrete
         */
        CMU_WEB_THICKNESS: 32,
        /**
         * Cmu_Web_Thickness_Sm
         * @memberof data.standards.masonry.concrete
         */
        CMU_WEB_THICKNESS_SM: 26,
        /**
         * Cmu_4_Nom
         * @memberof data.standards.masonry.concrete
         */
        CMU_4_NOM: [inchesToMm(16), inchesToMm(4), inchesToMm(8)],
        /**
         * Cmu_6_Nom
         * @memberof data.standards.masonry.concrete
         */
        CMU_6_NOM: [inchesToMm(16), inchesToMm(6), inchesToMm(8)],
        /**
         * Cmu_8_Nom
         * @memberof data.standards.masonry.concrete
         */
        CMU_8_NOM: [inchesToMm(16), inchesToMm(8), inchesToMm(8)],
        /**
         * Cmu_10_Nom
         * @memberof data.standards.masonry.concrete
         */
        CMU_10_NOM: [inchesToMm(16), inchesToMm(10), inchesToMm(8)],
        /**
         * Cmu_12_Nom
         * @memberof data.standards.masonry.concrete
         */
        CMU_12_NOM: [inchesToMm(16), inchesToMm(12), inchesToMm(8)],
        /**
         * Cmu_4half_Nom
         * @memberof data.standards.masonry.concrete
         */
        CMU_4HALF_NOM: [inchesToMm(8), inchesToMm(4), inchesToMm(8)],
        /**
         * Cmu_6half_Nom
         * @memberof data.standards.masonry.concrete
         */
        CMU_6HALF_NOM: [inchesToMm(8), inchesToMm(6), inchesToMm(8)],
        /**
         * Cmu_8half_Nom
         * @memberof data.standards.masonry.concrete
         */
        CMU_8HALF_NOM: [inchesToMm(8), inchesToMm(8), inchesToMm(8)],
        /**
         * Cmu_10half_Nom
         * @memberof data.standards.masonry.concrete
         */
        CMU_10HALF_NOM: [inchesToMm(8), inchesToMm(10), inchesToMm(8)],
        /**
         * Cmu_12half_Nom
         * @memberof data.standards.masonry.concrete
         */
        CMU_12HALF_NOM: [inchesToMm(8), inchesToMm(12), inchesToMm(8)],
    }

    Object.entries(concrete).forEach(([concKey, concVal]) => {
        if (concKey.includes('_NOM')) {
            const newKey = concKey.replace('_NOM', '')
            concrete[newKey] = [
                concVal[0] - masonryCore.MORTAR_JOINT,
                concVal[1] - masonryCore.MORTAR_JOINT,
                concVal[2] - masonryCore.MORTAR_JOINT,
            ]
            concrete[`${newKey}_LG_JOINT`] = [
                concVal[0] - masonryCore.MORTAR_JOINT_LG,
                concVal[1] - masonryCore.MORTAR_JOINT_LG,
                concVal[2] - masonryCore.MORTAR_JOINT_LG,
            ]
        }
    });

    /**
     * Masonry standards
     * @namespace masonry
     * @memberof data.standards
     */
    const masonry = {
        ...masonryCore,
        brick,
        concrete,
    }

    return masonry
}

module.exports = { init: masonryStd };

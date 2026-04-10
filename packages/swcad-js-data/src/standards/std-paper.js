"use strict"

const inchesToMm = (numIn) => numIn * 25.4

/**
 * Paper standards
 * @namespace paper
 * @memberof data.standards
 */
const paperStd = ({ jscad }) => {

    // STANDARD: [width, height]
    /**
     * Metric standards
     * @memberof data.standards.paper
     */
    const metric = {
        A0: [841, 1189],
        A1: [594, 841],
        A2: [420, 594],
        A3: [297, 420],
        A4: [210, 297],
        A5: [148, 210],
        A6: [105, 148],
        A7: [74, 105],
        A8: [52, 74],
        A9: [37, 52],
        A10: [26, 37],
        B0: [1000, 1414],
        B1: [707, 1000],
        B2: [500, 707],
        B3: [353, 500],
        B4: [250, 353],
        B5: [167, 250],
        B6: [125, 176],
        B7: [88, 125],
        B8: [62, 88],
        B9: [44, 62],
        B10: [31, 44],
        C0: [917, 1297],
        C1: [648, 917],
        C2: [458, 648],
        C3: [324, 458],
        C4: [229, 324],
        C5: [162, 229],
        C6: [114, 162],
        C7: [81, 114],
        C8: [57, 81],
        C9: [40, 57],
        C10: [28, 40],
    }

    /**
     * ANSI standards
     * @memberof data.standards.paper
     */
    const naAnsi = {
        ANSI_A: [inchesToMm(8.5), inchesToMm(11)],
        ANSI_B: [inchesToMm(11), inchesToMm(17)],
        ANSI_C: [inchesToMm(17), inchesToMm(22)],
        ANSI_D: [inchesToMm(22), inchesToMm(34)],
        ANSI_E: [inchesToMm(34), inchesToMm(44)],
    }

    /**
     * North American architecture standards
     * @memberof data.standards.paper
     */
    const naArch = {
        ARCH_A: [inchesToMm(9), inchesToMm(12)],
        ARCH_B: [inchesToMm(12), inchesToMm(18)],
        ARCH_C: [inchesToMm(18), inchesToMm(24)],
        ARCH_D: [inchesToMm(24), inchesToMm(36)],
        ARCH_E1: [inchesToMm(30), inchesToMm(42)],
        ARCH_E: [inchesToMm(36), inchesToMm(48)],
    }

    /**
     * Imperial standards
     * @memberof data.standards.paper
     */
    const imperial = {
        ansi: naAnsi,
        arch: naArch,
        LETTER: naAnsi.ANSI_A,
        LEGAL: [inchesToMm(8.5), inchesToMm(14)],
        TABLOID: naAnsi.ANSI_B,
        LEDGER: [inchesToMm(17), inchesToMm(11)],
    }

    /**
     * Card standards
     * @memberof data.standards.paper
     */
    const cards = {
        BUSINESS_CARD: [inchesToMm(3.5), inchesToMm(2)],
        BUSINESS_CARD_SQ: [inchesToMm(2.5), inchesToMm(2.5)],
        CREDIT_CARD: [85.6, 53.98],
        DEVOTIONAL: [inchesToMm(2.5), inchesToMm(4.5)],
        INDEX_SM: [inchesToMm(5), inchesToMm(3)],
        INDEX_MD: [inchesToMm(6), inchesToMm(4)],
        INDEX_LG: [inchesToMm(8), inchesToMm(5)],
        INDEX_XL: [inchesToMm(9), inchesToMm(6)],
        POSTCARD: [inchesToMm(6), inchesToMm(4)],
    }

    /**
     * Bookmark standards
     * @memberof data.standards.paper
     */
    const bookmarks = {
        BOOKMARK_SM: [inchesToMm(1.5), inchesToMm(4.5)],
        BOOKMARK_MD: [inchesToMm(2), inchesToMm(6.5)],
        BOOKMARK_LG: [inchesToMm(2.25), inchesToMm(8.5)],
    }

    /**
     * Poster standards
     * @memberof data.standards.paper
     */
    const poster = {
        POSTERJAM: metric.B2,
        ALBUM_COVER: [inchesToMm(12 + (3 / 8)), inchesToMm(12 + (3 / 8))],
    }

    /**
     * Photos standards
     * @memberof data.standards.paper
     */
    const photos = {
        PASSPORT_CAN: [50, 70],
        PASSPORT_US: [inchesToMm(2), inchesToMm(2)],
        WALLET: [inchesToMm(2), inchesToMm(3)],
        R2: [inchesToMm(2.5), inchesToMm(3.5)],
        R3: [inchesToMm(3.5), inchesToMm(5)],
        R4: [inchesToMm(5.04), inchesToMm(6)],
        R5: [inchesToMm(5), inchesToMm(7)],
        R6: [inchesToMm(6), inchesToMm(8)],
        R8: [inchesToMm(8), inchesToMm(10)],
        R10: [inchesToMm(10), inchesToMm(12)],
        R11: [inchesToMm(11), inchesToMm(14)],
        R12: [inchesToMm(12), inchesToMm(15)],
    }

    return {
        cards,
        metric,
        imperial,
        bookmarks,
        poster,
        photos
    }
}

module.exports = { init: paperStd };

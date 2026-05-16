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
     * @namespace metric
     * @memberof data.standards.paper
     */
    const metric = {
        /**
         * A0 sheet
         * @memberof data.standards.paper.metric
         */
        A0: [841, 1189],
        /**
         * A1 sheet
         * @memberof data.standards.paper.metric
         */
        A1: [594, 841],
        /**
         * A2 sheet
         * @memberof data.standards.paper.metric
         */
        A2: [420, 594],
        /**
         * A3 sheet
         * @memberof data.standards.paper.metric
         */
        A3: [297, 420],
        /**
         * A4 sheet
         * @memberof data.standards.paper.metric
         */
        A4: [210, 297],
        /**
         * A5 sheet
         * @memberof data.standards.paper.metric
         */
        A5: [148, 210],
        /**
         * A6 sheet
         * @memberof data.standards.paper.metric
         */
        A6: [105, 148],
        /**
         * A7 sheet
         * @memberof data.standards.paper.metric
         */
        A7: [74, 105],
        /**
         * A8 sheet
         * @memberof data.standards.paper.metric
         */
        A8: [52, 74],
        /**
         * A9 sheet
         * @memberof data.standards.paper.metric
         */
        A9: [37, 52],
        /**
         * A10 sheet
         * @memberof data.standards.paper.metric
         */
        A10: [26, 37],
        /**
         * B0 sheet
         * @memberof data.standards.paper.metric
         */
        B0: [1000, 1414],
        /**
         * B1 sheet
         * @memberof data.standards.paper.metric
         */
        B1: [707, 1000],
        /**
         * B2 sheet
         * @memberof data.standards.paper.metric
         */
        B2: [500, 707],
        /**
         * B3 sheet
         * @memberof data.standards.paper.metric
         */
        B3: [353, 500],
        /**
         * B4 sheet
         * @memberof data.standards.paper.metric
         */
        B4: [250, 353],
        /**
         * B5 sheet
         * @memberof data.standards.paper.metric
         */
        B5: [167, 250],
        /**
         * B6 sheet
         * @memberof data.standards.paper.metric
         */
        B6: [125, 176],
        /**
         * B7 sheet
         * @memberof data.standards.paper.metric
         */
        B7: [88, 125],
        /**
         * B8 sheet
         * @memberof data.standards.paper.metric
         */
        B8: [62, 88],
        /**
         * B9 sheet
         * @memberof data.standards.paper.metric
         */
        B9: [44, 62],
        /**
         * B10 sheet
         * @memberof data.standards.paper.metric
         */
        B10: [31, 44],
        /**
         * C0 sheet
         * @memberof data.standards.paper.metric
         */
        C0: [917, 1297],
        /**
         * C1 sheet
         * @memberof data.standards.paper.metric
         */
        C1: [648, 917],
        /**
         * C2 sheet
         * @memberof data.standards.paper.metric
         */
        C2: [458, 648],
        /**
         * C3 sheet
         * @memberof data.standards.paper.metric
         */
        C3: [324, 458],
        /**
         * C4 sheet
         * @memberof data.standards.paper.metric
         */
        C4: [229, 324],
        /**
         * C5 sheet
         * @memberof data.standards.paper.metric
         */
        C5: [162, 229],
        /**
         * C6 sheet
         * @memberof data.standards.paper.metric
         */
        C6: [114, 162],
        /**
         * C7 sheet
         * @memberof data.standards.paper.metric
         */
        C7: [81, 114],
        /**
         * C8 sheet
         * @memberof data.standards.paper.metric
         */
        C8: [57, 81],
        /**
         * C9 sheet
         * @memberof data.standards.paper.metric
         */
        C9: [40, 57],
        /**
         * C10 sheet
         * @memberof data.standards.paper.metric
         */
        C10: [28, 40],
    }

    /**
     * ANSI standards
     * @namespace imperialAnsi
     * @memberof data.standards.paper
     */
    const imperialAnsi = {
        /**
         * Ansi_A sheet
         * @memberof data.standards.paper.imperialAnsi
         */
        ANSI_A: [inchesToMm(8.5), inchesToMm(11)],
        /**
         * Ansi_B sheet
         * @memberof data.standards.paper.imperialAnsi
         */
        ANSI_B: [inchesToMm(11), inchesToMm(17)],
        /**
         * Ansi_C sheet
         * @memberof data.standards.paper.imperialAnsi
         */
        ANSI_C: [inchesToMm(17), inchesToMm(22)],
        /**
         * Ansi_D sheet
         * @memberof data.standards.paper.imperialAnsi
         */
        ANSI_D: [inchesToMm(22), inchesToMm(34)],
        /**
         * Ansi_E sheet
         * @memberof data.standards.paper.imperialAnsi
         */
        ANSI_E: [inchesToMm(34), inchesToMm(44)],
    }

    /**
     * North American architecture standards
     * @namespace imperialArch
     * @memberof data.standards.paper
     */
    const imperialArch = {
        /**
         * Arch_A sheet
         * @memberof data.standards.paper.imperialArch
         */
        ARCH_A: [inchesToMm(9), inchesToMm(12)],
        /**
         * Arch_B sheet
         * @memberof data.standards.paper.imperialArch
         */
        ARCH_B: [inchesToMm(12), inchesToMm(18)],
        /**
         * Arch_C sheet
         * @memberof data.standards.paper.imperialArch
         */
        ARCH_C: [inchesToMm(18), inchesToMm(24)],
        /**
         * Arch_D sheet
         * @memberof data.standards.paper.imperialArch
         */
        ARCH_D: [inchesToMm(24), inchesToMm(36)],
        /**
         * Arch_E1 sheet
         * @memberof data.standards.paper.imperialArch
         */
        ARCH_E1: [inchesToMm(30), inchesToMm(42)],
        /**
         * Arch_E sheet
         * @memberof data.standards.paper.imperialArch
         */
        ARCH_E: [inchesToMm(36), inchesToMm(48)],
    }

    /**
     * Imperial standards
     * @namespace imperial
     * @memberof data.standards.paper
     */
    const imperial = {
        /**
         * Letter sheet
         * @memberof data.standards.paper.imperial
         */
        LETTER: imperialAnsi.ANSI_A,
        /**
         * Legal sheet
         * @memberof data.standards.paper.imperial
         */
        LEGAL: [inchesToMm(8.5), inchesToMm(14)],
        /**
         * Tabloid sheet
         * @memberof data.standards.paper.imperial
         */
        TABLOID: imperialAnsi.ANSI_B,
        /**
         * Ledger sheet
         * @memberof data.standards.paper.imperial
         */
        LEDGER: [inchesToMm(17), inchesToMm(11)],
    }

    /**
     * Card standards
     * @namespace cards
     * @memberof data.standards.paper
     */
    const cards = {
        /**
         * Business_Card sheet
         * @memberof data.standards.paper.cards
         */
        BUSINESS_CARD: [inchesToMm(3.5), inchesToMm(2)],
        /**
         * Business_Card_Sq sheet
         * @memberof data.standards.paper.cards
         */
        BUSINESS_CARD_SQ: [inchesToMm(2.5), inchesToMm(2.5)],
        /**
         * Credit_Card sheet
         * @memberof data.standards.paper.cards
         */
        CREDIT_CARD: [85.6, 53.98],
        /**
         * Devotional sheet
         * @memberof data.standards.paper.cards
         */
        DEVOTIONAL: [inchesToMm(2.5), inchesToMm(4.5)],
        /**
         * Index_Sm sheet
         * @memberof data.standards.paper.cards
         */
        INDEX_SM: [inchesToMm(5), inchesToMm(3)],
        /**
         * Index_Md sheet
         * @memberof data.standards.paper.cards
         */
        INDEX_MD: [inchesToMm(6), inchesToMm(4)],
        /**
         * Index_Lg sheet
         * @memberof data.standards.paper.cards
         */
        INDEX_LG: [inchesToMm(8), inchesToMm(5)],
        /**
         * Index_Xl sheet
         * @memberof data.standards.paper.cards
         */
        INDEX_XL: [inchesToMm(9), inchesToMm(6)],
        /**
         * Postcard sheet
         * @memberof data.standards.paper.cards
         */
        POSTCARD: [inchesToMm(6), inchesToMm(4)],
    }

    /**
     * Bookmark standards
     * @namespace bookmarks
     * @memberof data.standards.paper
     */
    const bookmarks = {
        /**
         * Bookmark_Sm sheet
         * @memberof data.standards.paper.bookmarks
         */
        BOOKMARK_SM: [inchesToMm(1.5), inchesToMm(4.5)],
        /**
         * Bookmark_Md sheet
         * @memberof data.standards.paper.bookmarks
         */
        BOOKMARK_MD: [inchesToMm(2), inchesToMm(6.5)],
        /**
         * Bookmark_Lg sheet
         * @memberof data.standards.paper.bookmarks
         */
        BOOKMARK_LG: [inchesToMm(2.25), inchesToMm(8.5)],
    }

    /**
     * Poster standards
     * @namespace poster
     * @memberof data.standards.paper
     */
    const poster = {
        /**
         * Posterjam sheet
         * @memberof data.standards.paper.poster
         */
        POSTERJAM: metric.B2,
        /**
         * Album_Cover sheet
         * @memberof data.standards.paper.poster
         */
        ALBUM_COVER: [inchesToMm(12 + (3 / 8)), inchesToMm(12 + (3 / 8))],
    }

    /**
     * Photos standards
     * @namespace photos
     * @memberof data.standards.paper
     */
    const photos = {
        /**
         * Passport_Can photo
         * @memberof data.standards.paper.photos
         */
        PASSPORT_CAN: [50, 70],
        /**
         * Passport_Us photo
         * @memberof data.standards.paper.photos
         */
        PASSPORT_US: [inchesToMm(2), inchesToMm(2)],
        /**
         * Wallet photo
         * @memberof data.standards.paper.photos
         */
        WALLET: [inchesToMm(2), inchesToMm(3)],
        /**
         * R2 photo
         * @memberof data.standards.paper.photos
         */
        R2: [inchesToMm(2.5), inchesToMm(3.5)],
        /**
         * R3 photo
         * @memberof data.standards.paper.photos
         */
        R3: [inchesToMm(3.5), inchesToMm(5)],
        /**
         * R4 photo
         * @memberof data.standards.paper.photos
         */
        R4: [inchesToMm(5.04), inchesToMm(6)],
        /**
         * R5 photo
         * @memberof data.standards.paper.photos
         */
        R5: [inchesToMm(5), inchesToMm(7)],
        /**
         * R6 photo
         * @memberof data.standards.paper.photos
         */
        R6: [inchesToMm(6), inchesToMm(8)],
        /**
         * R8 photo
         * @memberof data.standards.paper.photos
         */
        R8: [inchesToMm(8), inchesToMm(10)],
        /**
         * R10 photo
         * @memberof data.standards.paper.photos
         */
        R10: [inchesToMm(10), inchesToMm(12)],
        /**
         * R11 photo
         * @memberof data.standards.paper.photos
         */
        R11: [inchesToMm(11), inchesToMm(14)],
        /**
         * R12 photo
         * @memberof data.standards.paper.photos
         */
        R12: [inchesToMm(12), inchesToMm(15)],
    }

    return {
        cards,
        metric,
        imperial,
        imperialAnsi,
        imperialArch,
        bookmarks,
        poster,
        photos
    }
}

module.exports = { init: paperStd };

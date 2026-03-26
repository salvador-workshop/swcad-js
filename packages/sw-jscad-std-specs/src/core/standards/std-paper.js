"use strict"

const paperStd = ({ lib, swLib }) => {
    const { constants, maths } = swLib.core

    // STANDARD: [width, height]
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

    const naAnsi = {
        ANSI_A: [maths.inchesToMm(8.5), maths.inchesToMm(11)],
        ANSI_B: [maths.inchesToMm(11), maths.inchesToMm(17)],
        ANSI_C: [maths.inchesToMm(17), maths.inchesToMm(22)],
        ANSI_D: [maths.inchesToMm(22), maths.inchesToMm(34)],
        ANSI_E: [maths.inchesToMm(34), maths.inchesToMm(44)],
    }

    const naArch = {
        ARCH_A: [maths.inchesToMm(9), maths.inchesToMm(12)],
        ARCH_B: [maths.inchesToMm(12), maths.inchesToMm(18)],
        ARCH_C: [maths.inchesToMm(18), maths.inchesToMm(24)],
        ARCH_D: [maths.inchesToMm(24), maths.inchesToMm(36)],
        ARCH_E1: [maths.inchesToMm(30), maths.inchesToMm(42)],
        ARCH_E: [maths.inchesToMm(36), maths.inchesToMm(48)],
    }

    const imperial = {
        ansi: naAnsi,
        arch: naArch,
        LETTER: naAnsi.ANSI_A,
        LEGAL: [maths.inchesToMm(8.5), maths.inchesToMm(14)],
        TABLOID: naAnsi.ANSI_B,
        LEDGER: [maths.inchesToMm(17), maths.inchesToMm(11)],
    }

    const cards = {
        BUSINESS_CARD: [maths.inchesToMm(3.5), maths.inchesToMm(2)],
        BUSINESS_CARD_SQ: [maths.inchesToMm(2.5), maths.inchesToMm(2.5)],
        CREDIT_CARD: [85.6, 53.98],
        DEVOTIONAL: [maths.inchesToMm(2.5), maths.inchesToMm(4.5)],
        INDEX_SM: [maths.inchesToMm(5), maths.inchesToMm(3)],
        INDEX_MD: [maths.inchesToMm(6), maths.inchesToMm(4)],
        INDEX_LG: [maths.inchesToMm(8), maths.inchesToMm(5)],
        INDEX_XL: [maths.inchesToMm(9), maths.inchesToMm(6)],
        POSTCARD: [maths.inchesToMm(6), maths.inchesToMm(4)],
    }

    const bookmarks = {
        BOOKMARK_SM: [maths.inchesToMm(1.5), maths.inchesToMm(4.5)],
        BOOKMARK_MD: [maths.inchesToMm(2), maths.inchesToMm(6.5)],
        BOOKMARK_LG: [maths.inchesToMm(2.25), maths.inchesToMm(8.5)],
    }

    const poster = {
        POSTERJAM: metric.B2,
        ALBUM_COVER: [maths.inchesToMm(12 + (3 / 8)), maths.inchesToMm(12 + (3 / 8))],
    }

    const photos = {
        PASSPORT_CAN: [50, 70],
        PASSPORT_US: [maths.inchesToMm(2), maths.inchesToMm(2)],
        WALLET: [maths.inchesToMm(2), maths.inchesToMm(3)],
        R2: [maths.inchesToMm(2.5), maths.inchesToMm(3.5)],
        R3: [maths.inchesToMm(3.5), maths.inchesToMm(5)],
        R4: [maths.inchesToMm(5.04), maths.inchesToMm(6)],
        R5: [maths.inchesToMm(5), maths.inchesToMm(7)],
        R6: [maths.inchesToMm(6), maths.inchesToMm(8)],
        R8: [maths.inchesToMm(8), maths.inchesToMm(10)],
        R10: [maths.inchesToMm(10), maths.inchesToMm(12)],
        R11: [maths.inchesToMm(11), maths.inchesToMm(14)],
        R12: [maths.inchesToMm(12), maths.inchesToMm(15)],
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

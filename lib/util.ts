import { getBibleBooks } from "./api"

export function preloadData() {
    const { data: bibleData } = getBibleBooks()

    if (bibleData) {
        globalThis.bookNames = bibleData.map((entry) => entry.n).slice(0, 66)
    }
}
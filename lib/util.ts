import { bibleBooks } from "../data/bibleBooks"

export function preloadData() {
    globalThis.bookNames = bibleBooks.map((entry) => entry.n).slice(0, 66)
    globalThis.bibleNameToNumber = bibleBooks.reduce(function(map, obj) {
        map[obj.n] = obj.i;
        return map;
    }, {});
    globalThis.bibleNumberToName = bibleBooks.reduce(function(map, obj) {
        map[obj.i] = obj.n;
        return map;
    }, {});
}

export function range(size:number, startAt:number = 0):ReadonlyArray<number> {
    return [...Array(size).keys()].map(i => i + startAt);
}

export function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

export function isDev(): boolean
{
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

export function getBibleTextDir(text, bookNum) {
    return (bookNum < 40 && (text == 'Tanakhxx' || text.startsWith('OHGB') || text == "MOB")) ? 'rtl' : 'ltr'
}

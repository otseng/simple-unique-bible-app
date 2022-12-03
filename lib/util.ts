import { bibleBooks } from "../data/bibleBooks"

export function preloadData() {
    globalThis.bookNames = bibleBooks.map((entry) => entry.n).slice(0, 66)
    globalThis.bibleNameToNumber = bibleBooks.reduce(function (map, obj) {
        map[obj.n] = obj.i;
        return map;
    }, {});
    globalThis.bibleNumberToName = bibleBooks.reduce(function (map, obj) {
        map[obj.i] = obj.n;
        return map;
    }, {});
}

export function range(size: number, startAt: number = 0): ReadonlyArray<number> {
    return [...Array(size).keys()].map(i => i + startAt);
}

export function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

export function isMobile(): boolean {
    return (typeof window !== 'undefined') && window.innerWidth < 820
}

export function isDev(): boolean {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

export function getBibleTextDir(text, bookNum) {
    return (bookNum < 40 && (['Tanakhxx', 'MIB', 'MOB', 'MAB', 'MPB', 'MTB'].indexOf(text) > -1 || text.startsWith('OHGB'))) ? 'rtl' : 'ltr'
}

export function getLocalStorage(key) {
    if (typeof localStorage == 'undefined') return
    return JSON.parse(localStorage.getItem(key)) || null
}

export function setLocalStorage(key, value) {
    if (typeof localStorage == 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
}

export function bookmarkExists(link) {
    const bookmarks = getLocalStorage('bookmarks') || []
    return bookmarks.includes(link)
}

export function addBookmark(link) {
    const bookmarks = getLocalStorage('bookmarks') || []
    if (!bookmarkExists(link)) {
        bookmarks.push(link)
        const sorted = bookmarks.sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
            return 0;
        })
        setLocalStorage('bookmarks', sorted)
    }
}

export function getBookmarks() {
    const bookmarks = getLocalStorage('bookmarks') || []
    return bookmarks
}

export function deleteBookmark(key) {
    const bookmarks = getLocalStorage('bookmarks') || []
    const updatedBookmarks = bookmarks.filter((item) => {
        return item != key
    })
    setLocalStorage('bookmarks', updatedBookmarks)
}
import { bibleBooks } from "../lang/bibleBooks_en"

export function getLang() {
    let lang = getLocalStorage("lang")
    if (!lang) {
        if (windowExists()) {
            const host = window.location.host
            if (host.startsWith("en.") || host.startsWith("simple.")) {
                lang = "en"
            } else if (host.startsWith("zh_HANT.") || host.startsWith("tc.")) {
                lang = "zh_HANT"
            } else if (host.startsWith("zh_HANS.") || host.startsWith("sc.")) {
                lang = "zh_HANS"
            }
        } else {
            lang = "en"
        }
    }
    if (isDev()) {
        // lang = "zh_HANT"
        // lang = "zh_HANS"
        // lang = "en"
    }
    setLocalStorage("lang", lang)
    return lang
}

export async function preloadData() {

    let importer = null
    let tmpBibleBooks = null

    if (windowExists()) {
        try {
            importer = await import("../lang/bibleBooks_" + getLang())
        } catch (error) {
            console.log("lang/bibleBooks_" + getLang() + " is not available")
            importer = await import("../lang/bibleBooks_en")
        }

        tmpBibleBooks = importer.bibleBooks
    } else {
        tmpBibleBooks = bibleBooks
    }

    globalThis.bookNames = tmpBibleBooks.map((entry) => entry.n).slice(0, 66)
    globalThis.bibleNameToNumber = tmpBibleBooks.reduce(function (map, obj) {
        map[obj.n] = obj.i;
        return map;
    }, {});
    globalThis.bibleNumberToName = tmpBibleBooks.reduce(function (map, obj) {
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

export function windowExists(): boolean {
    return (typeof window !== 'undefined')
}

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
    if (link == '') return
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

export function isPowerMode() {
    return getLocalStorage("powerMode") == true
}

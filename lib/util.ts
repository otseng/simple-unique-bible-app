import { bibleBooks } from "../lang/bibleBooks_en"
import { getLang } from "../lang/langUtil"
import { getTheme } from "../theme/themeUtil"

export async function preloadData() {

    let importer = null
    let tmpBibleBooks = null

    if (windowExists()) {
        try {
            importer = await import("../lang/bibleBooks_" + getLang())
        } catch (error) {
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

export function getBibleNumberFromName(name: string) {
    let bookNum = 0
    if (typeof globalThis.bibleNameToNumber != "undefined") {
        bookNum = globalThis.bibleNameToNumber[name]
    }
    return bookNum
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

export function getBookmarks(limit = 100) {
    let bookmarks = getLocalStorage('bookmarks') || []
    bookmarks = bookmarks.slice(0, limit)
    return bookmarks
}


export function getSermons() {
    const sermons = getLocalStorage('sermons') || []
    var newSermons = []
    for (const sermon of sermons) {
        const data = sermon.split("|")
        newSermons.push(data[1])
    }
    return newSermons
}

export function addSermon(link) {
    const sermons = getLocalStorage('sermons') || []
    var newSermons = []
    for (const sermon of sermons) {
        const data = sermon.split("|")
        const date = Date.parse(data[0])
        if (data[1] != link) {
            newSermons.push(sermon)
        }
    }
    const now = new Date();
    const sermon = now + "|" + link
    newSermons.push(sermon)
    setLocalStorage('sermons', newSermons)
    pruneSermons()
}

export function pruneSermons() {
    const sermons = getLocalStorage('sermons') || []
    var newSermons = []
    const timeCheck = 3600 * 5 // 5 days
    for (const sermon of sermons) {
        const data = sermon.split("|")
        const time = Date.parse(data[0]) / 1000
        const now = new Date().getTime() / 1000
        if (now - time < timeCheck) {
            newSermons.push(sermon)
        }
    }
    setLocalStorage('sermons', newSermons)
}

export function deleteBookmark(key) {
    const bookmarks = getLocalStorage('bookmarks') || []
    const updatedBookmarks = bookmarks.filter((item) => {
        return item.replace("#", "!") != key.replace("#", "!")
    })
    setLocalStorage('bookmarks', updatedBookmarks)
}

export function isPowerMode() {
    return getLocalStorage("powerMode") == true
}

export function isChineseMode() {
    return getLocalStorage("chineseMode") == true
}

export function highlight(html: string, searchText: string): any {
    let style = "background-color:#f7dc6f; color: black;"
    if (getTheme() == "dark") {
      style = "background-color: #f7dc6f; color: black;"
    }

    if (searchText.startsWith('"') && searchText.endsWith('"')) {
        searchText = searchText.replaceAll('"', '')
        html = html.replace(new RegExp("(" + searchText + ")", "ig"), "<span style='" + style + "'>$1</span>")
    } else if (searchText.endsWith(' ')) {
        html = html.replace(new RegExp("(" + searchText + ")", "ig"), "<span style='" + style + "'>$1</span>")
    } else if (searchText.includes(" ")) {
      searchText.split(' ').map((word) => {
        html = html.replace(new RegExp("(" + word + ")", "ig"), "<span style='" + style + "'>$1</span>")
      })
    } else {
      searchText = searchText.replaceAll('"', '')
      html = html.replace(new RegExp("(" + searchText + ")", "ig"), "<span style='" + style + "'>$1</span>")
    }
    return html
}

export function highlightStrongs(html: string, searchText: string): any {
    let style = "background-color:#f7dc6f; color: black;"
    if (getTheme() == "dark") {
      style = "background-color: #f7dc6f; color: black;"
    }

    searchText = searchText.replaceAll('"', '')
    html = html.replace(new RegExp("(\\w+ " + searchText + ")", "ig"), "<span style='" + style + "'>$1</span>")
    
    return html
}

export function removeOnEvents(html: string): any {
    html = html.replace(new RegExp("onmouseover=\".*\"", "ig"), "")
    html = html.replace(new RegExp("onmouseout=\".*\"", "ig"), "")
    html = html.replace(new RegExp("onclick=\".*\"", "ig"), "")
    return html
}

export function processLexiconData(html: string): any {
    html = html.replaceAll('\nTransliteration:', '<br/>\nTransliteration:')
    html = html.replaceAll('<a href', '<a target="new" href')
    return html
}

export function convertMarkdownToHtml(text: string): string {
    let html = text
    html = html.replaceAll(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
    html = html.replaceAll(/\*(.*?)\*/g, '<em>$1</em>') // italic
    html = html.replaceAll(/__(.*?)__/g, '<u>$1</u>') // underline
    html = html.replaceAll(/~~(.*?)~~/g, '<del>$1</del>') // strikethrough
    html = html.replaceAll(/`(.*?)`/g, '<code>$1</code>') // inline code
    // html = html.replaceAll(/^#\s+(.*)\n/g, '<h1>$1</h1>\n') // h1
    // html = html.replaceAll(/^##\s+(.*)\n/g, '<h1>$1</h1>\n') // h2
    html = html.replaceAll(/\n/g, '<br/>') // new line
    return html
}

export function convertBibleNamesToAbbreviation(text: string): string {
    let map = {"Genesis": "gen",
        "Exodus": "exod",
        "Leviticus": "lev",
        "Numbers": "num",
        "Deuteronomy": "deut",
        "Joshua": "josh",
        "Judges": "judg",
        "Ruth": "ruth",
        "1 Samuel": "1sam",
        "2 Samuel": "2sam",
        "1 Kings": "1kings",
        "2 Kings": "2kings",
        "1 Chronicles": "1chr",
        "2 Chronicles": "2chr",
        "Ezra": "ezra",
        "Nehemiah": "neh",
        "Esther": "esther",
        "Job": "job",
        "Psalms": "ps",
        "Proverbs": "prov",
        "Ecclesiastes": "eccl",
        "Song": "song",
        "Isaiah": "isa",
        "Jeremiah": "jer",
        "Lamentations": "lam",
        "Ezekiel": "ezek",
        "Daniel": "dan",
        "Hosea": "hos",
        "Joel": "joel",
        "Amos": "amos",
        "Obadiah": "obad",
        "Jonah": "jonah",
        "Micah": "mic",
        "Nahum": "nah",
        "Habakkuk": "hab",
        "Zephaniah": "zeph",
        "Haggai": "hag",
        "Zechariah": "zech",
        "Malachi": "mal",
        'Matthew': 'matt',
        'Mark': 'mark',
        'Luke': 'luke',
        'John': 'john',
        'Acts': 'acts',
        'Romans': 'rom',
        '1 Corinthians': '1cor',
        '2 Corinthians': '2cor',
        'Galatians': 'gal',
        'Ephesians': 'eph',
        'Philippians': 'pp',
        'Colossians': 'col',
        '1 Thessalonians': '1thess',
        '2 Thessalonians': '2thess',
        '1 Timothy': '1tim',
        '2 Timothy': '2tim',
        'Titus': 'titus',
        'Philemon': 'philem',
        'Hebrews': 'heb',
        'James': 'jas',
        '1 Peter': '1pet',
        '2 Peter': '2pet',
        '1 John': '1john',
        '2 John': '2john',
        '3 John': '3john',
        'Jude': 'jude',
        'Revelation': 'rev'
    }
    return map[text]
}


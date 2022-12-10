import { getLocalStorage, windowExists, isDev, setLocalStorage } from "../lib/util"

export function showDevotions() {
    const lang = getLang()
    if (lang == "en") {
        return true
    } else {
        return false
    }
}

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
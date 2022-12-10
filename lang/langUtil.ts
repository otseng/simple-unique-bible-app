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
    let lang = getLocalStorage("lang") || "en"
    if (windowExists()) {
        const host = window.location.host
        if (host.startsWith("en.") || host.startsWith("simple.")) {
            lang = "en"
        } else if (host.startsWith("zh_HANT.") || host.startsWith("tc.")) {
            lang = "zh_HANT"
        } else if (host.startsWith("zh_HANS.") || host.startsWith("sc.")) {
            lang = "zh_HANS"
        }
    }
    return lang
}
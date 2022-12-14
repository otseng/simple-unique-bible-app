import { getLocalStorage, windowExists, isDev, setLocalStorage } from "../lib/util"

export function getTheme() {
    let theme = getLocalStorage("theme") || "default"
    if (windowExists()) {
        const host = window.location.host
        // if (host.startsWith("en.") || host.startsWith("simple.")) {
        //     theme = "default"
        // } else if (host.startsWith("zh_HANT.") || host.startsWith("tc.")) {
        //     theme = "default"
        // } else if (host.startsWith("zh_HANS.") || host.startsWith("sc.")) {
        //     theme = "default"
        // }
        setLocalStorage("theme", theme)
    }
    return theme
}
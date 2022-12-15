import { getLocalStorage, windowExists, isDev, setLocalStorage } from "../lib/util"

export function getTheme() {
    const theme = getLocalStorage("theme") || "default"
    return theme
}
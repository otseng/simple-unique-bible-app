import isDev from "./util"

export const APP_NAME = 'Simple Unique Bible Viewer'
export const API_SERVER = isDev() ? 'http://localhost:8080' : 'https://uniquebibleapp.com/api'


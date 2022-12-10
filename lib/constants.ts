import { isDev } from "./util"

export const APP_NAME = 'Simple Unique Bible Viewer'
export const DOMAIN = 'https://simple.uniquebibleapp.com'
export const API_SERVER = isDev() ? 'http://localhost:8080' : (DOMAIN + '/api')
// export const API_SERVER = DOMAIN + '/api'

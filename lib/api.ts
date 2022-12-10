import axios from 'axios'
import useSWR from 'swr'
import { API_SERVER } from './constants'
import md5 from 'md5'
import { getLang, getLocalStorage, isPowerMode } from './util'

const auth = {
  username: 'simpleubaclient',
  password: getPassword()
}

function getPassword() {
  let pass = "uniquebibleapp" + (new Date().getUTCMonth() + 1)
  pass = md5(pass)
  return pass
}

export function getBibles() {

  const address = API_SERVER + '/bible?' + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBibleBooks() {
  const address = API_SERVER + '/data/bible/abbreviations?lang=eng'
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBibleTextBooks(text) {
  const address = API_SERVER + `/data/bible/books/${text}?` + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBibleChapter(text, bookNumber, chapter) {
  const address = API_SERVER + `/bible/${text}/${bookNumber}/${chapter}?` + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBooks() {

  const address = API_SERVER + '/book?' + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBookChapters(title) {

  if (title) {
    title = title.replaceAll(' ', '+')
  }
  const address = API_SERVER + `/book/${title}?` + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBookChapterContent(title, chapter) {

  if (title) {
    title = title.replaceAll('%20', '+').replaceAll(' ', '+')
    chapter = chapter.replaceAll('%20', '+').replaceAll(' ', '+')
  }
  const address = API_SERVER + `/book/${title}/${chapter}?` + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getCommentaries() {

  const address = API_SERVER + '/commentary?' + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getCommentaryContent(title, bookNumber, chapter) {

  const address = API_SERVER + `/commentary/${title}/${bookNumber}/${chapter}?` + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getDevotionals() {

  const address = API_SERVER + `/devotional?` + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getDevotionalContent(book, month, day) {

  if (book) {
    book = book.replaceAll('%20', '+').replaceAll(' ', '+')
  }

  const address = API_SERVER + `/devotional/${book}/${month}/${day}?` + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getCompareVerses(book, chapter, verse) {

  let address = API_SERVER + `/compare/${book}/${chapter}/${verse}?` + addLang()
  console.log("1 compare address: " + address)

  if (getLang() == "en") {
    address = address + '&text=KJV&text=WEB&text=NET'
    console.log("2 compare address: " + address)

    if (isPowerMode()) {
      address = address +
        '&text=ESV&text=NASB&text=NIV&text=AMP&text=TLB&text=TPT&text=MSG'
        console.log("3 compare address: " + address)

    }
    address = address +
      '&text=ERV&text=ISV&text=ULT&text=UST&text=2001' +
      '&text=BBE&text=EasyEnglish&text=NHEB&text=PESH' +
      '&text=ASV&text=LEB' +
      '&text=YLT&text=Darby&txt=KJV1611&text=Geneva&text=Wesley&text=Bishops&text=Wycliffe'
      console.log("4 compare address: " + address)

    address = address +
      '&text=TRLIT&text=TRLITx' +
      '&text=KJVx&text=HKJVx' +
      '&text=ASVx&text=LEBx&text=WEBx&text=NETx'
    if (isPowerMode()) {
      address = address +
        '&text=NASBx'
    }
    address = address +
      '&text=OHGB' +
      '&text=Tanakhxx&text=MOB' +
      '&text=Greek%2b&text=TRx' +
      '&text=CUV&text=Pinyin'
  } else if (getLang().startsWith("zh")) {
    address = address +
      '&text=CUV&text=CUVs&text=Pinyin' +
      '&text=KJV&text=KJVx' +
      '&text=Tanakhxx&text=MOB' +
      '&text=Greek%2b'
  }
  console.log("5 compare address: " + address)
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getCrossReferences(book, chapter, verse, text) {

  const address = API_SERVER + `/crossreference/${book}/${chapter}/${verse}/${text}?` + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function searchBible(searchText, text) {

  const address = API_SERVER + `/search?type=bible&searchText=` + searchText + '&text=' + text +
    '&' + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

let cacheLexicon: Map<string, string> = new Map();

export async function _getLexicon(lexicon, strongs) {

  const key = lexicon + "-" + strongs
  if (!cacheLexicon.has(key)) {
    const address = API_SERVER + `/lexicon/${lexicon}/${strongs}?` + addLang()
    const res = await axios.get(address, { auth })
    const data = await res.data.data
    cacheLexicon.set(key, data)
  }
  return cacheLexicon.get(key)
}

let cacheInstantLex: Map<string, string> = new Map();

export async function _getInstantLex(strongs) {

  if (!cacheInstantLex.has(strongs)) {
    const address = API_SERVER + `/data/lex/${strongs}?` + addLang()
    const res = await axios.get(address, { auth })
    const data = await res.data.data
    cacheInstantLex.set(strongs, data)
  }
  return cacheInstantLex.get(strongs)
}

let cacheCommentaryContent: Map<string, string> = new Map();

export async function _getCommentaryContent(title, bookNumber, chapter) {

  const key = title + '_' + bookNumber + '_' + chapter
  if (!cacheCommentaryContent.has(key)) {
    const address = API_SERVER + `/commentary/${title}/${bookNumber}/${chapter}?` + addLang()
    const res = await axios.get(address, { auth })
    const data = await res.data.data
    cacheCommentaryContent.set(key, data)
  }

  return cacheCommentaryContent.get(key)
}

let cacheMorphology: Map<string, string> = new Map();

export async function _getMorphology(portion, wordId) {

  const key = portion + '_' + wordId
  if (!cacheMorphology.has(key)) {
    const address = API_SERVER + `/morphology/${portion}/${wordId}?` + addLang()
    const res = await axios.get(address, { auth })
    const data = await res.data.data
    cacheMorphology.set(key, data)
  }

  return cacheMorphology.get(key)
}

let cacheSearchToolmETCBC: Map<string, string> = new Map();

export async function _getSearchTool(module, text) {

  const key = module + "_" + text
  if (!cacheSearchToolmETCBC.has(key)) {
    const address = API_SERVER + `/searchtool/${module}/${text}?` + addLang()
    const res = await axios.get(address, { auth })
    const data = await res.data.data
    cacheSearchToolmETCBC.set(key, data)
  }

  return cacheSearchToolmETCBC.get(key)
}

function addLang() {
  let lang = getLocalStorage("lang")
  if (!lang) lang = "en"
  let add = "lang=" + lang
  if (isPowerMode()) {
    add += "x"
  }
  return add
}

export function clearCache() {
  cacheLexicon = new Map()
  cacheInstantLex = new Map()
  cacheCommentaryContent = new Map()
  cacheMorphology = new Map()
  cacheSearchToolmETCBC = new Map()
}

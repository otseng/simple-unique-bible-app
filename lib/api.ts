import axios from 'axios'
import useSWR from 'swr'
import { API_SERVER } from './constants'
import md5 from 'md5'
import { getLocalStorage, isPowerMode } from './util'
import { getLang } from '../lang/langUtil'

const auth = {
  username: 'simpleubaclient',
  password: getPassword()
}

function getPassword() {
  const secret = "uniquebibleapp" + (new Date().getUTCMonth() + 1)
  const pass = md5(secret)
  return pass
}

export function getBibles() {

  const address = API_SERVER + '/bible?' + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  const powerMode = isPowerMode()

  if (powerMode && data && data.indexOf("KJV-CUVl-Pinyin-CUVx") < 0) data.unshift("KJV-CUVl-Pinyin-CUVx")
  if (data && data.indexOf("KJV-TRLITx") < 0) data.unshift("KJV-TRLITx")

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
  if (text == '') {
    text = 'KJV'
  }
  const address = API_SERVER + `/bible/${text}/${bookNumber}/${chapter}?` + addLang()
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBibleVerse(text, bookNumber, chapter, verse) {
  const address = API_SERVER + `/bible/${text}/${bookNumber}/${chapter}/${verse}?` + addLang()
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
  const powerMode = isPowerMode()
  if (getLang() == "en") {
    address = address + '&text=KJV&text=WEB&text=NET'
    if (powerMode) {
      address = address + '&text=ESV&text=NASB&text=NIV&text=HCSB&text=NRSV&text=NABRE&text=LEB' +
        '&text=NLT&&text=TLB&text=AMP&text=MSG&text=EXB&text=TPT'
    }
    address = address + '&text=ERV&text=ISV&text=ULT&text=2001'
    if (powerMode) {
      address = address + '&text=PESH&text=CJB'
    }
    address = address + '&text=ASV&text=DRB' +
        '&text=YLT&text=KJV1611&text=Geneva' +
        '&text=Bishops&text=Tyndale&text=Wycliffe' +
        '&text=LXXE&text=TRLITx&text=KJVx'
    if (powerMode) {
      address = address + '&text=CUV&text=Pinyin&text=MOB&text=HEBT'
    }
  } else if (getLang().startsWith("zh")) {
    address = address +
      '&text=CUV&text=CUVs&text=Pinyin' +
      '&text=KJV&text=KJVx' +
      '&text=Tanakhxx&text=MOB' +
      '&text=Greek%2b'
  }
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

export function concordanceSearch(strongs, text) {

  const address = API_SERVER + '/concordance/' + text + '/' + strongs
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function lexiconReverse(searchText, lexicon) {

  const address = API_SERVER + `/lexiconreverse/` + lexicon + '/' + searchText
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}


export function getBook2Number() {

  const address = API_SERVER + `/data/bible/book2number`
  const fetcher = async (url) => await axios.get(url, { auth }).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getSubheadings(book, chapter) {

  const address = API_SERVER + `/subheadings/${book}/${chapter}`
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
  if (window !== undefined) {
    const key = lexicon + "-" + strongs
    if (!cacheLexicon.has(key)) {
      try {
        const address = API_SERVER + `/lexicon/${lexicon}/${strongs}?` + addLang()
        const res = await axios.get(address, { auth })
        const data = await res.data.data
        cacheLexicon.set(key, data)
      } catch (error) {
        console.log(error)
      }
    }
    return cacheLexicon.get(key)
  }
}

let cacheInstantLex: Map<string, string> = new Map();

export async function _getInstantLex(strongs) {
  if (window !== undefined) {
    if (!cacheInstantLex.has(strongs)) {
      const address = API_SERVER + `/data/lex/${strongs}?` + addLang()
      const res = await axios.get(address, { auth })
      const data = await res.data.data
      cacheInstantLex.set(strongs, data)
    }
    return cacheInstantLex.get(strongs)
  }
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

let cacheDiscourse: Map<string, string> = new Map();

export async function _getDiscourse(book, chapter, verse) {

  const key = book + "_" + chapter + "_" + verse
  if (!cacheDiscourse.has(key)) {
    const address = API_SERVER + `/discourse/${book}/${chapter}/${verse}`
    const res = await axios.get(address, { auth })
    const data = await res.data.data
    cacheDiscourse.set(key, data)
  }
  return cacheDiscourse.get(key)
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
  cacheDiscourse = new Map()
}

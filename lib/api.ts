import axios from 'axios'
import useSWR from 'swr'
import { API_SERVER } from './constants'

const auth = {
  username: 'ubaclient',
  password: 'uniquebibleapp'
}

export function getBibles() {
  
  const address = API_SERVER + '/bible'
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBibleBooks() {
  const address = API_SERVER + '/data/bible/abbreviations?lang=eng'
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBibleTextBooks(text) {
  const address = API_SERVER + `/data/bible/books/${text}`
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBibleChapter(text, bookNumber, chapter) {
  const address = API_SERVER + `/bible/${text}/${bookNumber}/${chapter}`
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getBooks() {
  
  const address = API_SERVER + '/book'
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
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
  const address = API_SERVER + `/book/${title}`
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
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
  const address = API_SERVER + `/book/${title}/${chapter}`
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getCommentaries() {
  
  const address = API_SERVER + '/commentary'
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getCommentaryContent(title, bookNumber, chapter) {
  
  const address = API_SERVER + `/commentary/${title}/${bookNumber}/${chapter}`
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getDevotionals() {
  
  const address = API_SERVER + `/devotional`
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
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

  const address = API_SERVER + `/devotional/${book}/${month}/${day}`
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getCompareVerses(book, chapter, verse) {
  
  if (!book || book == 'undefined') {
    return {
      data: null,
      loading: null, // Promise.resolve("Loading"),
      error: null
    }
  }
  const address = API_SERVER + `/compare/${book}/${chapter}/${verse}`+ 
  '?text=KJV&text=KJVx&text=HKJVx' +
  '&text=TRLIT&text=TRLITx' + 
  '&text=ASV&text=ASVx' +
  '&text=LEB&text=LEBx' + 
  '&text=WEB&text=WEBx' +
  '&text=NET&text=NETx' +
  '&text=ERV&text=ISV&text=ULT&text=UST&text=2001' +
  '&text=BBE&text=EasyEnglish&text=NHEB&text=PESH' +
  '&text=YLT&text=Darby&txt=KJV1611&text=Geneva&text=Wesley&text=Bishops&text=Wycliffe' +
  '&text=OHGB' +
  '&text=Tanakhxx&text=MOB' +
  '&text=Greek%2b&text=TRx' +
  '&text=CUV&text=Pinyin'
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function getCrossReferences(book, chapter, verse, text) {
  
  const address = API_SERVER + `/crossreference/${book}/${chapter}/${verse}/${text}`
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}

export function searchBible(searchText, text) {
  
  if (!searchText || searchText == 'undefined') {
    return {
      data: null,
      loading: null,
      error: null
    }
  }

  const address = API_SERVER + `/search?type=bible&searchText=` + searchText + '&text=' + text
  console.log(address)
  const fetcher = async (url) => await axios.get(url, {auth}).then((res) => res.data.data)
  const { data, error } = useSWR(address, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error
  }
}
export async function getLexicon(lexicon, strongs) {
  
  const address = API_SERVER + `/lexicon/${lexicon}/${strongs}`
  const res = await axios.get(address, {auth})
  const data = await res.data.data
  console.log(data)
  return data
}

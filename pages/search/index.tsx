import { Disclosure } from '@headlessui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Container from '../../components/container';
import Intro from '../../components/intro';
import Layout from '../../components/layout';
import { getBibles, getBook2Number } from '../../lib/api';
import { APP_NAME } from '../../lib/constants';
import Select from 'react-select'
import Input from 'rc-input';
import { useLang } from '../../lang/langContext';
import { getLocalStorage, isDev, preloadData, setLocalStorage } from '../../lib/util';
import toast from 'react-hot-toast';
import { useTheme } from '../../theme/themeContext';
import Link from 'next/link';
require('dotenv').config()

export default function Index() {

  if (!globalThis.bibleBooks || !globalThis.bookNames) preloadData()

  const { lang, setLang } = useLang()
  const { theme, setTheme } = useTheme()

  const router = useRouter()

  let fullText = router.query.text as string
  if (!fullText || fullText == "undefined") fullText = "KJV-TRLITx"
  let text = fullText
  if (fullText && fullText.indexOf("-") > -1) {
    const texts = text.split("-")
    text = texts[0]
  }

  let search = router.query.q as string
  let books = router.query.books as string
  if (!books || books == "undefined") books = "All"

  const [searchText, setSearchText] = useState('')
  const [selectedBible, setSelectedBible] = useState('')
  const [selectedBooks, setSelectedBooks] = useState('')

  let books2Number = new Map()

  const { data: bibleData, loading, error } = getBibles()
  const { data: book2NumberData, loading: book2NumberLoading, error: book2NumberError } = getBook2Number()

  let searches = getSearches()

  useEffect(() => {
    const element = document.getElementById('search-text')
    if (element) {
      element.focus()
    }
  });

  useEffect(() => {
    if (!router.isReady) return;
    setSearchText(search)
    setSelectedBible(fullText)
    setSelectedBooks(books)
  }, [router.isReady]);

  function enterCommand() {
    if (searchText !== undefined && searchText.length > 0) {
      setSearchText("")
      if (searchText.startsWith(".")) {
        processCommand(searchText.substring(1))
      } else if (checkReference()) {
      } else {
        if (selectedBible.startsWith("CUV") || searchText.length > 2) {
          searchBible()
        }
      }
    }
  }

  function clearSearchText() {
    setSearchText("")
  }

  function reverseTRLITLexicon() {
    setSearchText("")
    searchLexiconReverse("TRLIT")
  }

  function reverseCEDictLexicon() {
    setSearchText("")
    searchLexiconReverse("CEDict")
  }

  function concordance() {
    setSearchText("")
    concordanceSearch()
  }

  function checkReference() {
    if (searchText.includes(" ")) {
      const parse1 = searchText.split(" ")
      let book = parse1[0]
      book =  book.charAt(0).toUpperCase() + book.slice(1); 
      let chapter = 1
      let verse = 1
      if (parse1[1].includes(":")) {
        const parse2 = parse1[1].split(":")
        chapter = parseInt(parse2[0])
        verse = parseInt(parse2[1])
      } else {
        chapter = parseInt(parse1[1])
      }
      let foundBook = ""
      if (books2Number.has(book)) {
        foundBook = books2Number.get(book)
      }
      if (foundBook == "" || foundBook == undefined) {
        if (books2Number.has(book + ".")) {
          foundBook = books2Number.get(book + ".")
        }
      }
      if (foundBook == "" || foundBook == undefined) {
        book = book.replace("1", "1 ")
        book = book.replace("2", "2 ")
        book = book.replace("3", "3 ")
        if (books2Number.has(book)) {
          foundBook = books2Number.get(book)
        }
      }
      if (foundBook == "" || foundBook == undefined) {
        return false
      }
      if (Number.isNaN(chapter)) {
        chapter = 1
      }
      if (Number.isNaN(verse)) {
        verse = 1
      }
      const bookName = globalThis.bibleNumberToName[parseInt(foundBook)]
      const url = `/bible/${selectedBible}/${bookName}/${chapter}#v${chapter}_${verse}`
      addSearch(url)
      router.push(url)
      return true
    }
    return false
  }

  function reloadPage() {
    const url = `/search`
    router.push(url)
  }

  function getSearches() {
    const searches = getLocalStorage('searches') || []
    return searches
  }

  function deleteOne(search) {
    deleteSearch(search)
    searches = getSearches()
    setSearchText("")
    reloadPage()
  }

  function deleteAll() {
    setLocalStorage('searches', [])
    setSearchText("")
    searches = []
    reloadPage()
  }

  function deleteSearch(key) {
    const updatedSearches = searches.filter((item) => {
        return item != key
    })
    searches = updatedSearches
    setLocalStorage('searches', updatedSearches)
  }

  function addSearch(link) {
    const searches = getLocalStorage('searches') || []
    if (!searches.includes(link)) {
      searches.push(link)
      setLocalStorage('searches', searches)
    }
  }

  function searchBible() {
    setSearchText("")
    const url = `/search/bible/${searchText}?fullText=${selectedBible}&books=${selectedBooks}`
    addSearch(url)
    router.push(url)
  }

  function searchLexiconReverse(lexicon) {
    const url = `/search/lexiconreverse/${lexicon}/${searchText}`
    addSearch(url)
    router.push(url)
  }

  function concordanceSearch() {
    let bible = selectedBible
    let text = searchText.toUpperCase()
    if (!bible.endsWith('x')) {
      bible = 'KJVx'
    }
    const regex = /[GgHh][0-9]*/
    const matches = regex.exec(text)

    if (matches) {
      const url = `/search/concordance/${bible}/${text}`
      addSearch(url)
      router.push(url)
    } else {
      toast.error("Invalid Strong's number")
    }
  }

  function searchTextChange(event) {
    const text = event.target.value
    if (text.length < 50) {
      setSearchText(text)
    }
  }

  function searchTextKeyPress(event) {
    if (event.charCode == 13) {
      enterCommand()
    }
  }

  function handleBibleChange(e) {
    setSelectedBible(e.value);
  }

  function handleBookChange(e) {
    setSelectedBooks(e.value);
  }

  function processCommand(text: string) {
    const lowerText = text.toLowerCase()
    const cmd = lowerText.split(" ")
    switch (cmd[0]) {
      case process.env.NEXT_PUBLIC_POWER_MODE:
        if (cmd.length > 1) {
          if (cmd[1] == "on") enablePowerMode()
          if (cmd[1] == "off") disablePowerMode()
        }
        break
      case 'chinese':
        if (cmd.length > 1) {
          if (cmd[1] == "on") enableChineseMode()
          if (cmd[1] == "off") disableChineseMode()
        }
        break
      case ',,,':
        disablePowerMode()
        break
    }
  }

  function enablePowerMode() {
    setLocalStorage("powerMode", true)
    toast("Power mode on")
  }

  function disablePowerMode() {
    setLocalStorage("powerMode", false)
    toast("Power mode off")
  }

  function enableChineseMode() {
    setLocalStorage("chineseMode", true)
    toast("Chinese mode on")
  }

  function disableChineseMode() {
    setLocalStorage("chineseMode", false)
    toast("Chinese mode off")
  }

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (bibleData && book2NumberData) {

    const bibleOptions = bibleData.map((bible) => (
      { value: bible, label: bible }
    ))

    let booksOptions = [
      {value: "All", label: "All"},
      {value: "Old Testament", label: "Old Testament"},
      {value: "New Testament", label: "New Testament"}]
    for (let i = 1; i <= 66; i++) {
      let name = globalThis.bibleNumberToName[i]
      booksOptions.push({value: name, label: name})
    }

    if (books2Number.size == 0) {
      for (const rec of book2NumberData) {
        let book = rec['b']
        books2Number.set(book, rec['n'])
        book = book.toLowerCase()
        books2Number.set(book, rec['n'])
      }
    }

    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="Search" />

            <Disclosure defaultOpen>
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">{lang.Search}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">

                <div className="m-10">
                  <div className="flex justify-center items-center">
                    <Input id="search-text" className={`w-100 ${theme.searchInput}`}
                      type="search" value={searchText}
                      onChange={searchTextChange} onKeyPress={searchTextKeyPress} />

                    <button className={`${theme.clickableButton}`} onClick={clearSearchText}>x</button>

                  </div>
                  <div className="flex flex-col md:flex-row justify-center items-center mb-5 mt-5">
                    <span className="text-lg mr-2">{lang.Bible}:</span>
                    <Select className="ml-2 mt-2 w-40" options={bibleOptions}
                      value={bibleOptions.filter(obj => obj.value === selectedBible)}
                      onChange={handleBibleChange}
                    />
                    <Select className="ml-2 mt-2 w-40" options={booksOptions}
                      value={booksOptions.filter(obj => obj.value === selectedBooks)}
                      onChange={handleBookChange}
                    />
                    <span className="ml-2">
                      <button className={`${theme.clickableButton}`} onClick={enterCommand}>{lang.Search}</button>
                    </span>
                  </div>
                  <div className="flex justify-center items-center">
                  <button className={`${theme.clickableButton}`} onClick={concordance}>{lang.Strongs}</button>
                  <button className={`${theme.clickableButton}`} onClick={reverseTRLITLexicon}>{lang.Reverse_Lexicon_Search}</button>
                  <button className={`${theme.clickableButton}`} onClick={reverseCEDictLexicon}>{lang.Reverse_Chinese_Search}</button>
                  </div>
                  
                  {searches.length > 0 && <>
                    <div className="flex justify-center items-center mt-10 mb-5">
                      <p className="font-lg font-bold">Previous searches</p>
                    </div>
                    </>}
                  {searches.map((search) => {
                    let regex = new RegExp("/search/bible/(.*)\\?fullText=(.*)&books=(.*)")
                    let matches = regex.exec(search)
                    if (matches) {
                      const searchText = matches[1]
                      const bible = matches[2]
                      const books = matches[3]

                      return (
                        <>
                          <div className="flex justify-center items-center ">
                            <Link href={search}>
                              <button className={`${theme.clickableButton}`}>Search {bible} ({books}) "{searchText}"</button>
                            </Link>
                            <button id={search} onClick={() => deleteOne(search)} className={`${theme.clickableButton}`}>{lang.Delete}</button>
                          </div>
                        </>
                      )
                    }
                    regex = new RegExp("/search/concordance/(.*)/(.*)")
                    matches = regex.exec(search)
                    if (matches) {
                      const text = matches[1]
                      const strongs = matches[2]

                      return (
                        <>
                          <div className="flex justify-center items-center ">
                            <Link href={search}>
                              <button className={`${theme.clickableButton}`}>Strong's {text} {strongs}</button>
                            </Link>
                            <button id={search} onClick={() => deleteOne(search)} className={`${theme.clickableButton}`}>{lang.Delete}</button>
                          </div>
                        </>
                      )
                    }
                    regex = new RegExp("/bible/(.*)/(.*)/(.*)#v(.*)_(.*)")
                    matches = regex.exec(search)
                    if (matches) {
                      const text = matches[1]
                      const book = matches[2]
                      const chapter = matches[3]
                      const verse = matches[5]

                      return (
                        <>
                          <div className="flex justify-center items-center ">
                            <Link href={search}>
                              <button className={`${theme.clickableButton}`}>Bible {book} {chapter}:{verse} ({text})</button>
                            </Link>
                            <button id={search} onClick={() => deleteOne(search)} className={`${theme.clickableButton}`}>{lang.Delete}</button>
                          </div>
                        </>
                      )
                    }
                    regex = new RegExp("/lexiconreverse/(.*)/(.*)")
                    matches = regex.exec(search)
                    if (matches) {
                      const lexicon = matches[1]
                      const word = matches[2]

                      return (
                        <>
                          <div className="flex justify-center items-center ">
                            <Link href={search}>
                              <button className={`${theme.clickableButton}`}>Reverse {lexicon} {word}</button>
                            </Link>
                            <button id={search} onClick={() => deleteOne(search)} className={`${theme.clickableButton}`}>{lang.Delete}</button>
                          </div>
                        </>
                      )
                    }
                  })}

                  {searches.length > 0 && <>
                  <div className="flex justify-center p-1">
                    <button onClick={deleteAll} className={`${theme.clickableButton}`}>{lang.Delete_All}</button>
                  </div>
                  </>}

                </div>

              </Disclosure.Panel>
            </Disclosure>

          </Container>
        </Layout>
      </>
    )
  }
}


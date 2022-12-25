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
import { preloadData, setLocalStorage } from '../../lib/util';
import toast from 'react-hot-toast';
import { useTheme } from '../../theme/themeContext';

export default function Index() {

  if (!globalThis.bibleBooks || !globalThis.bookNames) preloadData()

  const { lang, setLang } = useLang()
  const {theme, setTheme} = useTheme()

  const router = useRouter()
  let text = router.query.text as string
  if (!text) text = "KJV"
  let search = router.query.q as string

  const [searchText, setSearchText] = useState()
  const [selectedBible, setSelectedBible] = useState()
  let books2Number = new Map()
  
  const { data, loading, error } = getBibles()
  const { data: book2NumberData, loading: book2NumberLoading, error: book2NumberError } = getBook2Number()

  useEffect(() => {
    const element = document.getElementById('search-text')
    if (element) {
      element.focus()
    }
  });

  useEffect(()=>{
    if(!router.isReady) return;
    setSearchText(search)
    setSelectedBible(text)
}, [router.isReady]);

  function enterCommand() {
    setSearchText("")
    if (searchText.startsWith(".")) {
      processCommand(searchText.substring(1))
    } else if (checkReference()) {
    } else {
      searchBible()
    }
  }

  function checkReference() {
    if (searchText.includes(":") && searchText.includes(" ")) {
      const parse1 = searchText.split(" ")
      let book = parse1[0]
      const parse2 = parse1[1].split(":")
      const chapter = parse2[0]
      const verse = parse2[1]
      let foundBook = ""
      if (books2Number.has(book)) {
        foundBook = books2Number.get(book)
      }
      if (foundBook == "") {
        book = book + "."
        if (books2Number.has(book)) {
          foundBook = books2Number.get(book)
        } 
      }
      if (foundBook == "") {
        return false
      }
      const bookName = globalThis.bibleNumberToName[parseInt(foundBook)]
      const url = `/bible/${selectedBible}/${bookName}/${chapter}#v${chapter}_${verse}`
      router.push(url)
      return true
    }
    return false
  }
  
  function searchBible() {
    const url = `/search/bible/${searchText}?text=${selectedBible}`
    router.push(url)
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

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (data && book2NumberData) {

    const bibleOptions = data.map((bible) => (
      { value: bible, label: bible }
    ))

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
                  <div className="flex justify-center items-center mb-5">
                    <span className="text-lg mr-2">{lang.Bible}:</span>
                    <Select options={bibleOptions}
                      value={bibleOptions.filter(obj => obj.value === selectedBible)}
                      onChange={handleBibleChange}
                    />
                  </div>
                  <div className="flex justify-center items-center">
                    <Input id="search-text" className={`${theme.searchInput}`}
                      type="text" value={searchText}
                      onChange={searchTextChange} onKeyPress={searchTextKeyPress} />
                  </div>
                  <div className="flex justify-center items-center">
                    <button className={`${theme.clickableButton}`} onClick={enterCommand}>{lang.Search}</button>
                  </div>
                </div>

              </Disclosure.Panel>
            </Disclosure>

          </Container>
        </Layout>
      </>
    )
  }
}

function processCommand(text: string) {
  const lowerText = text.toLowerCase()
  const cmd = lowerText.split(" ")
  switch (cmd[0]) {
    case 'power':
      if (cmd.length > 1) {
        if (cmd[1] == "on") enablePowerMode()
        if (cmd[1] == "off") disablePowerMode()
      } 
      break;
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

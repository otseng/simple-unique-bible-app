import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../../lib/constants'
import { addBookmark, bookmarkExists, deleteBookmark, getBibleNumberFromName, getBibleTextDir, isChineseMode, isMobile, isPowerMode, preloadData, processLexiconData, range, removeOnEvents } from '../../../../../lib/util'
import { getBibleChapter, getBibles, getBibleTextBooks, getCommentaries, getSubheadings, getBookChapterContent } from '../../../../../lib/api'
import { _getCommentaryContent, _getDiscourse, _getInstantLex, _getLexicon, _getMorphology, _getSearchTool } from '../../../../../lib/api'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { bibleChapters } from '../../../../../data/bibleChapters'
import { Disclosure } from '@headlessui/react'

import dynamic from 'next/dynamic';
const BasicModal = dynamic(() => import('../../../../../components/basic-modal'), {
  ssr: false
});

import {
  Menu,
  Item,
  Separator,
  useContextMenu,
  Submenu
} from "react-contexify"
import "react-contexify/dist/ReactContexify.css"
import { toast } from 'react-hot-toast'
import { useLang } from '../../../../../lang/langContext'
import { getLang } from '../../../../../lang/langUtil'
import { useTheme } from '../../../../../theme/themeContext'
import { getTheme } from '../../../../../theme/themeUtil'
import NoSsr from '../../../../../components/NoSsr'

const BIBLE_VERSE_POPUP_MENU = "bible-verse-popup-menu"

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const { lang, setLang } = useLang()
  const { theme, setTheme } = useTheme()

  const router = useRouter()
  const fullText = router.query.text as string
  let text = fullText
  let parallel1 = fullText
  let parallel2 = ''
  let parallel3 = ''
  let parallelMode = false
  let parallelCount = 0
  let chineseLexicon = false
  let locationHash = useRef('')
  if (fullText && fullText.indexOf("-") > -1) {
    const texts = text.split("-")
    parallelCount = texts.length
    text = texts[0]
    parallel1 = texts[1]
    if (parallel1 == "CUVl") chineseLexicon = true
    if (texts.length > 2) {
      parallel2 = texts[2]
    }
    if (texts.length > 3) {
      parallel3 = texts[3]
    }
    parallelMode = true
  }
  let book = router.query.book as string
  if (book) book = book.replaceAll("+", " ")
  const bookNum = getBibleNumberFromName(book)
  const chapter = router.query.chapter as string
  const commentary = router.query.commentary as string
  const showPrevious = parseInt(chapter) > 1
  const showNext = parseInt(chapter) < bibleChapters[bookNum]
  const chapters = range(bibleChapters[bookNum], 1)

  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')
  const [strongsModal, setStrongsModal] = useState('')

  const { show } = useContextMenu({
    id: BIBLE_VERSE_POPUP_MENU
  })
  const [scrolledRef, setScrolledRef] = useState(true)

  const { data: dataBibles, loading: loadingBibles, error: errorBibles } = getBibles()
  const { data: dataCommentaries, loading: loadingCommentaries, error: errorCommentaries } = getCommentaries()
  const { data: dataSubheadings, loading: loadingSubheadings, error: errorSubheadings } = getSubheadings(bookNum, chapter)
  const { data: dataBooks, loading: loadingBooks, error: errorBooks } = getBibleTextBooks(text)
  const { data, loading, error } = getBibleChapter(text, bookNum, chapter)
  const { data: dataParallel1, loading: loadingParallel1, error: errorParallel1 } = getBibleChapter(parallel1, bookNum, chapter)
  const { data: dataParallel2, loading: loadingParallel2, error: errorParallel2 } = getBibleChapter(parallel2, bookNum, chapter)
  const { data: dataParallel3, loading: loadingParallel3, error: errorParallel3 } = getBibleChapter(parallel3, bookNum, chapter)
  const { data: dataBookOverview, loading: loadingBookOverview, error: errorBookOverview } = getBookChapterContent('Bible_Book_Overviews', book)

  let biblesInPopup = []

  const menuTheme = (getTheme() == "dark" ? "dark" : "light")

  if (getLang() == "en") {
    biblesInPopup = []
    if (isPowerMode() || isChineseMode) {
      biblesInPopup.push.apply(biblesInPopup, ['KJV-CUVl-Pinyin-CUVx'])
    }
    if (isPowerMode()) {
      biblesInPopup.push.apply(biblesInPopup, ['KJV', 'ESV', 'NASB', 'NET', 'NIV', 'NKJV', 'NLT', 'MIB'])
    } else {
      biblesInPopup.push.apply(biblesInPopup, ['KJV', 'TRLITx', 'KJV-TRLITx', 'NET', 'WEB', 'MOB', 'MAB', 'MTB', 'MIB'])
    }
  } else if (getLang().startsWith("zh")) {
    biblesInPopup = ['CUV', 'CUVs', 'KJV', 'MIB']
  }

  useLayoutEffect(() => {
    window.addEventListener('scroll', function (event) { removeToast() });
    locationHash.current = window?.location?.hash
    if (commentary) {
      const element = document.getElementById('commentary-content')
      if (element) {
        element.scrollIntoView()
      }
    } else if (locationHash.current) {
      const id = locationHash.current.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        if (!(text == "MAB" || text == "MIB")) {
          element.style.backgroundColor = theme.highlighColor
        }
        if (scrolledRef) {
          window.scrollTo({
            behavior: 'smooth',
            top:
              element.getBoundingClientRect().top -
              document.body.getBoundingClientRect().top - 10,
          })
        }
      }
    }
    if (text == "MIB") {
      let elements = document.getElementsByTagName("wmorph")
      let module = "mETCBC"
      if (bookNum >= 40) module = "mRMAC"
      for (const element of elements) {
        const text = element.innerHTML
        element.className = "hover:cursor-pointer"
        element.addEventListener('mouseout', function (event) {
          removeToast()
        })
        element.addEventListener('click', function (event) {
          showSearchTool(module, text)
        })
        if (!isMobile()) {
          element.addEventListener('mouseover', function (event) {
            instantSearchTool(module, text)
          })
        }
      }
      elements = document.getElementsByTagName("wsn")
      for (const element of elements) {
        const text = element.innerHTML
        element.className = "hover:cursor-pointer"
        element.addEventListener('mouseout', function (event) {
          removeToast()
        })
        element.addEventListener('click', function (event) {
          showLexicon(text)
        })
        if (!isMobile()) {
          element.addEventListener('mouseover', function (event) {
            instantLexicon(text)
          })
        }
      }
    }
  });

  function handleItemClick({ id, event, props, data, triggerEvent }) {
    setScrolledRef(true)
    const targetId = triggerEvent?.srcElement?.id || event.target.id || ''
    const regex = /r(.*)_(.*)/
    const matches = regex.exec(targetId)
    const chapter = matches[1]
    const verse = matches[2]
    if (id == 'copyLink') {
      let url = window.location.protocol + '//' + window.location.host + `/bible/${fullText}/${book}/${chapter}#v${chapter}_${verse}`
      url = url.replaceAll(" ", "+")
      let contents = url + "\n"
      navigator.clipboard.writeText(contents)
      toast(lang.Copied_to_clipboard)
    } else if (id == 'copyVerse') {
      const type = "v"
      const verseTextElement = document.getElementById(type + chapter + "_" + verse)
      let contents = parallelMode ? "" : book + " " + chapter + ":" + verse + " (" + text + ")\n"
      contents += verseTextElement.innerText + "\n"
      // let url = window.location.protocol + '//' + window.location.host + `/bible/${text}/${book}/${chapter}#v${chapter}_${verse}`
      // url = url.replaceAll(" ", "+")
      // contents += url + "\n"
      navigator.clipboard.writeText(contents)
      toast(lang.Copied_to_clipboard)
    } else if (id == 'highlight') {
      const element = document.getElementById("v" + chapter + "_" + verse)
      if (element.style.backgroundColor == '') {
        clearHighlights()
        locationHash.current = `#v${chapter}_${verse}`
        router.push(`/bible/${fullText}/${book}/${chapter}#v${chapter}_${verse}`)
      } else {
        clearHighlights()
      }
    } else if (id == 'compare') {
      router.push(`/compare/${book}/${chapter}/${verse}?text=${fullText}`)
    } else if (id == 'xref') {
      router.push(`/xref/${book}/${chapter}/${verse}/${fullText}`)
    } else if (id == 'discourse') {
      showDiscourse(bookNum, chapter, verse)
    } else if (id == 'bookmark') {
      const url = `/bible/${fullText}/${book}/${chapter}#v${chapter}_${verse}`
      if (bookmarkExists(url)) {
        deleteBookmark(url)
        toast('Bookmark removed')
      } else {
        addBookmark(url)
        toast('Bookmark added')
      }
    } else if (id.startsWith("bible")) {
      clearHighlights()
      const bible = id.replace("bible-", "")
      router.push(`/bible/${bible}/${book}/${chapter}#v${chapter}_${verse}`)
    } else if (id == 'uba') {
      let bible = text
      if (bible == "CUVx" || parallel1 == "CUVl") {
        bible = "CUVs"
      }
      const cmd = `BIBLE:::${bible}:::${book} ${chapter}:${verse}`
      if (isPowerMode()) {
        window.open('https://uniquebibleapp.net/ubaTeamOnLY.html?cmd=' + cmd, '_new', 'noreferrer');
      } else {
        window.open('https://uniquebibleapp.net/index.html?cmd=' + cmd, '_new', 'noreferrer');
      }
    } else if (id == 'greeklab') {
      const book1 = book.replace(" ", "_")
      window.open(`https://www.greeklab.org/interlinear.php?book=${book1}&cap=${chapter}&verse=${verse}`, '_blank', 'noreferrer');
    }
  }

  function clearHighlights() {
    for (const x of Array(150).keys()) {
      const searchElement = "v" + chapter + "_" + (x + 1)
      const element = document.getElementById(searchElement)
      if (!element) break;
      element.style.backgroundColor = ''
    }
  }

  function displayMenu(e) {
    removeToast()
    if (e) {
      show({
        event: e,
      })
    }
  }

  function clickInModal(e) {
    const el = e.target
  }

  function showLexicon(strongs) {
    setScrolledRef(false)
    setStrongsModal(strongs)
    setModalTitle(strongs)
    try {
      _getLexicon('TRLIT', strongs).then((resp) => {
        removeToast()
        const html = processLexiconData(resp[0])
        if (!html.includes("[Not found]")) {
          setModalContent(html)
          setShowModal(true)
        } else {
          _getLexicon('SECE', strongs).then((resp) => {
            if (resp[0] != "[Not found]") {
              const html = resp[0]?.replaceAll('<a href', '<a target="new" href')
              setModalContent(html)
              setShowModal(true)
            }
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  function showChineseLexicon(chinese) {
    setScrolledRef(false)
    setModalTitle('CEDICT - ' + chinese)
    _getLexicon('CEDICT', chinese).then((resp) => {
      removeToast()
      const html = resp[0]
      if (!html.includes("[Not found]")) {
        setModalContent(html)
        setShowModal(true)
      } else {
        _getLexicon('CEDICT', chinese[0]).then((resp) => {
          setModalTitle('CEDICT - ' + chinese[0])
          const html = resp[0]
          setModalContent(html)
          setShowModal(true)
        })
      }
    })
  }

  function showDiscourse(book, chapter, verse) {
    setScrolledRef(false)
    setModalTitle('Discourse')
    _getDiscourse(book, chapter, verse).then((resp) => {
      removeToast()
      let html = resp
      html = removeOnEvents(html)
      setModalContent(html)
      setShowModal(true)
    })
  }

  function instantLexicon(strongs) {
    if (!isMobile()) {
      _getInstantLex(strongs).then((resp) => {
        removeToast()
        if (resp) {
          const info = strongs + " • " + resp[0] + " • " + resp[1] + " • " + resp[2] + " • " + resp[3]
          toast(info, { duration: 5000 })
        }
      })
    }
  }

  function instantChineseLexicon(strongs) {
    if (!isMobile()) {
      _getLexicon('CEDICT', strongs).then((resp) => {
        removeToast()
        if (resp && resp[0] != "[Not found]") {
          const info = resp[0].split('<br/>', 1)[0]
          toast(info, { duration: 5000 })
        }
      })
    }
  }

  function showMorphology(portion, wordId) {
    setScrolledRef(false)
    _getMorphology(portion, wordId).then((resp) => {
      removeToast()
      const html = resp[5] + " • " + resp[1] + " • " + resp[7] + " • " + resp[8] + "<br/>" + resp[4]
      setModalTitle('Morphology - ' + resp[0])
      setModalContent(html)
      setShowModal(true)
    }
    )
  }

  function instantMorphology(portion, wordId) {
    if (!isMobile()) {
      _getMorphology(portion, wordId).then((resp) => {
        removeToast()
        if (resp) {
          const definition = resp[7] || ''
          const info = resp[0] + " • " + resp[5] + " • " + definition + "\n" + resp[4].replaceAll(",", ", ")
          toast(info, { duration: 10000 })
        }
      })
    }
  }

  // mETCBC - OT
  // mRMAC - NT
  function showSearchTool(module, text) {
    setScrolledRef(false)
    _getSearchTool(module, text).then((resp) => {
      removeToast()
      if (resp) {
        let content = resp.replaceAll("<b>", "").replaceAll("</b>", "")
        setModalTitle(module)
        setModalContent(content)
        setShowModal(true)
      }
    })
  }

  function instantSearchTool(module, text) {
    _getSearchTool(module, text).then((resp) => {
      removeToast()
      if (resp) {
        let content = resp.replaceAll("<b>", "").replaceAll("</b>", "")
        toast(content, { duration: 10000 })
      }
    })
  }

  function removeToast() {
    toast.dismiss()
  }

  function renderSubheadings(verse) {
    if (getLang() == "en" && dataSubheadings && dataSubheadings[verse]) {
      return <p className={`${theme.subheadingText}`}>{dataSubheadings[verse]}<br/></p>
    } else {
      return <></>
    }
  }

  function searchStrongs() {
    let bible = text
    let strongs = strongsModal
    if (!bible.endsWith('x')) {
      bible = 'KJVx'
    }
    const codedHash = encodeURIComponent(locationHash.current)
    const url = `/search/concordance/${bible}/${strongs}?return=/bible/${fullText}/${book}/${chapter}${codedHash}`
    router.push(url)
  }

  function renderBookOverview(html) {
    if (html) {
        const index = html.indexOf("<h2>Title</h2>")
        html = html.substring(index)
        html =  "<article class='prose'>" + html + "</article>"
    }
    return <span dangerouslySetInnerHTML={{__html: html}} />
  }

  if (error || errorParallel1) return <div className={`${theme.bibleReferenceContainer}`}>Failed to load</div>
  if (loading && loadingParallel1) return <div>Loading...</div>

  if (data && dataBooks && dataBibles && dataCommentaries) {

    const mabBible = text == 'MAB'
    const mobBible = text == 'MOB'
    const mibBible = text == 'MIB'
    const mpbBible = text == 'MPB'
    const mtbBible = text == 'MTB'
    const marvelBible = mabBible || mobBible || mibBible || mpbBible || mtbBible
    const trlitxBible = text == 'TRLITx'
    const parseVerse = text.endsWith('x') || text.endsWith('+')
    const rawVerse = !mobBible && !mibBible && !parseVerse
    const bookNames = dataBooks.map((number) => globalThis.bibleNumberToName[number])

    const textDir = getBibleTextDir(text, bookNum)

    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            {showModal && <Intro currentPage="Bibles" visibility="invisible"/>}
            {!showModal && <Intro currentPage="Bibles"/>}

            <Disclosure>
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">{lang.Bibles}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataBibles.map((text, i) => {
                    const hash = window?.location?.hash
                    return (
                      <Link key={i} href={"/bible/" + text + "/" + book + "/" + chapter + "?commentary=" + hash}>
                        <button className={`${theme.clickableButton}`}>{text}</button>
                      </Link>
                    )
                  }
                  )}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">{fullText}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {bookNames.map((book, i) => (
                    <Link key={i} href={"/bible/" + fullText + "/" + book + "/1?commentary="}>
                      <button className={`${theme.clickableButton}`}>{book}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${theme.chapterDisclosure}`}>
                <div className="text-xl">{book} {chapter}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                {chapters.map((chapter, i) => (
                  <Link key={i} href={"/bible/" + fullText + "/" + book + "/" + chapter + "?commentary="}>
                    <button className={`${theme.clickableButton}`}>{chapter}</button>
                  </Link>
                ))}
              </Disclosure.Panel>
            </Disclosure>

            <div className="flex justify-center items-center mt-2 mb-5">
              {showPrevious &&
                <Link href={"/bible/" + fullText + '/' + book + '/' + (parseInt(chapter) - 1)}>
                  <button className={`${theme.clickableButton}`}>{lang.Previous}</button></Link>}
              {showNext &&
                <Link href={"/bible/" + fullText + '/' + book + '/' + (parseInt(chapter) + 1)}>
                  <button className={`${theme.clickableButton}`}>{lang.Next}</button></Link>}
            </div>

            <NoSsr>
            <div dir={textDir} className={`${theme.bibleDivContainer}`}>
              {(mabBible || mibBible || mtbBible || mpbBible) &&
                data.map((verse, i) => {
                  let text = verse.t
                  text = text.replaceAll(/<vid.*?<\/vid>/g, "")
                  text = text.replaceAll(/^(<br>)*/g, "")
                  text = text.replaceAll(/onclick=".*?"/g, "")
                  text = text.replaceAll(/ondblclick=".*?"/g, "")
                  text = text.replaceAll(/onmouseover=".*?"/g, "")
                  text = text.replaceAll(/onmouseout=".*?"/g, "")
                  return (
                    <p key={i} id={`v${verse.c}_${verse.v}`}>
                      <span className={`${theme.bibleReferenceContainer}`} onClick={displayMenu} id={`r${verse.c}_${verse.v}`}>{verse.c}:{verse.v}</span>
                      {(mtbBible || mpbBible) && <br />}
                      <span id={`t${verse.c}_${verse.v}`} className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: text }} /></p>
                  )
                })
              }
              {mobBible &&
                data.map((verse, i) => {
                  let verseContent = []
                  let text = verse.t
                  const type = bookNum < 40 ? 'heb' : 'grk'
                  let words = text.matchAll(new RegExp("<" + type + ".*?</" + type + ">", "g"))
                  words = Array.from(words)
                  for (const word of words) {
                    let portion = ''
                    let wordId = ''
                    let regex = new RegExp("searchWord[(](.*?),(.*?)[)]")
                    let matches = regex.exec(word[0])
                    if (matches) {
                      portion = matches[1]
                      wordId = matches[2]
                    }
                    regex = new RegExp("<" + type + ".*?>(.*?)</" + type + ">")
                    matches = regex.exec(word[0])
                    let aword = matches[1].replace("<pm>", "").replace("</pm>", "")
                    if (type == 'grk') aword = aword + ' '
                    verseContent.push([portion, wordId, aword])
                  }
                  return (
                    <span key={i}>
                      <p id={`v${verse.c}_${verse.v}`}>
                        <span id={`r${verse.c}_${verse.v}`} className={`${theme.bibleReferenceContainer}`} onClick={displayMenu} onMouseEnter={() => removeToast()}>{verse.c}:{verse.v} - </span>
                        <span className={`${theme.bibleTextContainer}`}>
                          {verseContent.map((data, j) => (
                            <span key={j} onMouseEnter={() => instantMorphology(data[0], data[1])} onMouseLeave={() => removeToast()} onClick={() => showMorphology(data[0], data[1])} className="hover:cursor-pointer">{data[2]}</span>
                          ))}
                        </span>
                      </p>
                    </span>
                  )
                }
                )
              }
              {rawVerse &&
                data.map((verse, i) => (verse.t &&
                  <span key={i}>
                  {renderSubheadings(`${verse.v}`)}
                  <p id={`v${verse.c}_${verse.v}`}>
                    {!parallelMode && <span className={`${theme.bibleReferenceContainer}`} onClick={displayMenu} id={`r${verse.c}_${verse.v}`}>{verse.c}:{verse.v} - </span>}
                    {parallelMode && <span className={`${theme.bibleReferenceContainer}`} onClick={displayMenu} id={`r${verse.c}_${verse.v}`}>{book} {verse.c}:{verse.v}</span>}
                    
                    {parallelMode && <><br/><br/><span className={`${theme.bibleReferenceContainer}`}>{text}:</span> </>}
                    <span id={`t${verse.c}_${verse.v}`} className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: verse.t }} />
                    {parallelMode && parallelCount >= 2 && dataParallel1 && <><br/><br/><span className={`${theme.bibleReferenceContainer}`}>{parallel1}:</span> </>}
                    {!chineseLexicon && parallelMode && parallelCount >= 2 && dataParallel1 && dataParallel1[i].t.split(' ').map((word, j) => (
                      word.match(/[GH][0-9]{1,4}/) ?
                        <a key={j} className={`${theme.textStrongs}`} 
                        onMouseEnter={() => instantLexicon(word)} onMouseLeave={() => removeToast()} 
                        onClick={() => showLexicon(word)}>{word} </a>
                        : <span key={j} className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: word + " " }} />
                    ))}
                    {chineseLexicon && parallelMode && parallelCount >= 2 && dataParallel1 && dataParallel1[i].t.split(' ').map((word, j) => (
                      word.match(/[：；。「 」，？]/) ?
                      <span key={j} className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: word + " " }} /> :
                      <a key={j} className={`${theme.bibleReferenceContainer}`} 
                      onMouseEnter={() => instantChineseLexicon(word)} onMouseLeave={() => removeToast()} 
                      onClick={() => showChineseLexicon(word)}>{word}</a>
                    ))}
                    {parallelMode && parallelCount >= 3 && dataParallel2 && <><br/><br/><span className={`${theme.bibleReferenceContainer}`}>{parallel2}:</span> </>}
                    {parallelMode && parallelCount >= 3 && dataParallel2 && dataParallel2[i].t.split(' ').map((word, j) => (
                      word.match(/[GH][0-9]{1,4}/) ?
                        <a key={j} className={`${theme.textStrongs}`} onMouseEnter={() => instantLexicon(word)} onMouseLeave={() => removeToast()} onClick={() => showLexicon(word)}>{word} </a>
                        : <span key={j} className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: word + " " }} />
                    ))}
                    {parallelMode && parallelCount >= 4 && dataParallel3 && <><br/><br/><span className={`${theme.bibleReferenceContainer}`}>{parallel3}:</span> </>}
                    {parallelMode && parallelCount >= 4 && dataParallel3 && dataParallel3[i].t.split(' ').map((word, j) => (
                      word.match(/[GH][0-9]{1,4}/) ?
                        <a key={j} className={`${theme.textStrongs}`} onMouseEnter={() => instantLexicon(word)} onMouseLeave={() => removeToast()} onClick={() => showLexicon(word)}>{word} </a>
                        : <span key={j} className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: word + " " }} />
                    ))}
                  </p>
                  {parallelMode && <><br/><br/></>}
                  </span>
                ))
              }
              {parseVerse &&
                data.map((verse, i) => (verse.t &&
                  <p key={i} id={`v${verse.c}_${verse.v}`}>
                    {!parallelMode && <span className={`${theme.bibleReferenceContainer}`} onClick={displayMenu} id={`r${verse.c}_${verse.v}`}>{verse.c}:{verse.v} - </span>}
                    {parallelMode && <span className={`${theme.bibleReferenceContainer}`} onClick={displayMenu} id={`r${verse.c}_${verse.v}`}>{book} {verse.c}:{verse.v}</span>}
                    
                    {parallelMode && <><br/><br/><span className={`${theme.bibleReferenceContainer}`}>{text}:</span></>}
                    {verse.t.split(' ').map((word, j) => (
                      word.match(/[GH][0-9]{1,4}/) ?
                        <a key={j} className={`${theme.textStrongs}`} onMouseEnter={() => instantLexicon(word)} onMouseLeave={() => removeToast()} onClick={() => showLexicon(word)}>{word} </a>
                        : <span key={j} className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: word + " " }} />
                    ))}
                    {parallelMode && <><br/><br/><span className={`${theme.bibleReferenceContainer}`}>{parallel1}:</span> </>}
                    {parallelMode && dataParallel1 && dataParallel1[i].t.split(' ').map((word, j) => (
                      word.match(/[GH][0-9]{1,4}/) ?
                        <a key={j} className={`${theme.textStrongs}`} onMouseEnter={() => instantLexicon(word)} onMouseLeave={() => removeToast()} onClick={() => showLexicon(word)}>{word} </a>
                        : <span key={j} className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: word + " " }} />
                    ))}
                    {parallelMode && parallel2 && <><br/><br/><span className={`${theme.bibleReferenceContainer}`}>{parallel2}:</span> </>}
                    {parallelMode && dataParallel2 && dataParallel2[i].t.split(' ').map((word, j) => (
                      word.match(/[GH][0-9]{1,4}/) ?
                        <a key={j} className={`${theme.textStrongs}`} onMouseEnter={() => instantLexicon(word)} onMouseLeave={() => removeToast()} onClick={() => showLexicon(word)}>{word} </a>
                        : <span key={j} className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: word + " " }} />
                    ))}
                    {parallelMode && parallel3 && <><br/><br/><span className={`${theme.bibleReferenceContainer}`}>{parallel3}:</span> </>}
                    {parallelMode && dataParallel3 && dataParallel3[i].t.split(' ').map((word, j) => (
                      word.match(/[GH][0-9]{1,4}/) ?
                        <a key={j} className={`${theme.textStrongs}`} onMouseEnter={() => instantLexicon(word)} onMouseLeave={() => removeToast()} onClick={() => showLexicon(word)}>{word} </a>
                        : <span key={j} className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: word + " " }} />
                    ))}
                    {parallelMode && <><br/><br/></>}
                  </p>
                ))
              }

            </div>
            </NoSsr>
            
            <div className="flex justify-center items-center mt-2 mb-5">
              {showPrevious &&
                <Link href={"/bible/" + fullText + '/' + book + '/' + (parseInt(chapter) - 1)}>
                  <button className={`${theme.clickableButton}`}>{lang.Previous}</button></Link>}
              {showNext &&
                <Link href={"/bible/" + fullText + '/' + book + '/' + (parseInt(chapter) + 1)}>
                  <button className={`${theme.clickableButton}`}>{lang.Next}</button></Link>}
            </div>

            <Disclosure>
              <Disclosure.Button className={`${theme.chapterDisclosure}`}>
                <div className="text-xl">{lang.Book_overview}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
              <div className={`${theme.booksTextContainer}`}>
              {
                renderBookOverview(dataBookOverview)
              }
              </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${theme.chapterDisclosure}`}>
                <div className="text-xl">{lang.Commentaries}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataCommentaries.map((commentary, i) => (
                    <Link key={i} href={"/commentary/" + commentary + '/' + book + '/' + chapter + '?text=' + fullText}>
                      <button className={`${theme.clickableButton}`}>
                        {commentary.replaceAll('_', ' ')}
                      </button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <BasicModal show={showModal} setter={setShowModal} title={modalTitle}
            content={modalContent} hash={locationHash.current} strongsModal={strongsModal} searchStrongs={searchStrongs} 
            showLexicon={showLexicon}></BasicModal>

            <Menu id={BIBLE_VERSE_POPUP_MENU} theme={menuTheme}>
              <Item id="bookmark" onClick={handleItemClick}><span className="text-md">{lang.Toggle_bookmark}</span></Item>
              <Item id="highlight" onClick={handleItemClick}><span className="text-md">{lang.Toggle_highlight}</span></Item>
              <Item id="copyVerse" onClick={handleItemClick}><span className="text-md">{lang.Copy_verse}</span></Item>
              <Item id="copyLink" onClick={handleItemClick}><span className="text-md">{lang.Copy_link}</span></Item>
              <Item id="xref" onClick={handleItemClick}><span className="text-md">{lang.Cross_references}</span></Item>
              <Item id="compare" onClick={handleItemClick}><span className="text-md">{lang.Compare}</span></Item>
              {/*!isMobile() && <Item id="discourse" onClick={handleItemClick}><span className="text-md">{lang.Discourse}</span></Item>*/}
              <Item id="uba" onClick={handleItemClick}><span className="text-md">UBA</span></Item>
              {!isMobile() && <Item id="greeklab" onClick={handleItemClick}><span className="text-md">Greeklab</span></Item>}
              {/*!isMobile() && <Separator />*/}
              {/* {!marvelBible && !trlitxBible && text != "KJVx" && <Item id={`bible-${text}-KJVx`} onClick={handleItemClick}><span className="text-md">{text}-KJVx</span></Item>} */}
              {isPowerMode() && text == "ASV" && <Item id={`bible-ASV-ASVx`} onClick={handleItemClick}><span className="text-md">ASV-ASVx</span></Item>}
              {isPowerMode() && text == "ESV" && <Item id={`bible-ESV-ESV2016x`} onClick={handleItemClick}><span className="text-md">ESV-ESV2016x</span></Item>}
              {isPowerMode() && text == "KJV" && <Item id={`bible-KJV-KJVx`} onClick={handleItemClick}><span className="text-md">KJV-KJVx</span></Item>}
              {isPowerMode() && text == "NASB" && <Item id={`bible-NASB-NASBx`} onClick={handleItemClick}><span className="text-md">NASB-NASBx</span></Item>}
              {isPowerMode() && text == "NET" && <Item id={`bible-NET-NETx`} onClick={handleItemClick}><span className="text-md">NET-NETx</span></Item>}
              {isPowerMode() && text == "NIV" && <Item id={`bible-NIV-NIV2011x`} onClick={handleItemClick}><span className="text-md">NIV-NIV2011x</span></Item>}
              {isPowerMode() && text == "NLT" && <Item id={`bible-NLT-NLT2015x`} onClick={handleItemClick}><span className="text-md">NLT-NLT2015x</span></Item>}
              {isPowerMode() && text == "NRSV" && <Item id={`bible-NRSV-NRSVx`} onClick={handleItemClick}><span className="text-md">NRSV-NRSVx</span></Item>} 
              {isPowerMode() && text == "WEB" && <Item id={`bible-WEB-WEBx`} onClick={handleItemClick}><span className="text-md">WEB-WEBx</span></Item>} 
              {isPowerMode() && ["MSG", "NWT", "PESH", "Recovery", "TPT"].indexOf(text) > -1 
                && <Item id={`bible-${text}-TRLITx`} onClick={handleItemClick}><span className="text-md">{text}-TRLITx</span></Item>} 
              {isPowerMode() && <Item id={`bible-KJV-TRLITx`} onClick={handleItemClick}><span className="text-md">KJV-TRLITx</span></Item>}
              {biblesInPopup.map((bible, i) => {
                const bibleId = "bible-" + bible
                return <Item key={i} id={bibleId} onClick={handleItemClick}><span className="text-md">{bible}</span></Item>
              })
              }
              {/* {bookNum < 40 && <Item id="bible-Tanakhxx" onClick={handleItemClick}><span className="text-md">Tanakhxx</span></Item>} */}
              {/* <Item id="bible-Greek+" onClick={handleItemClick}><span className="text-md">Greek+</span></Item> */}
            </Menu>

          </Container>
        </Layout>
      </>
    )
  }
}


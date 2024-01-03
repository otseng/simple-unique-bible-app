import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../../lib/constants'
import { addBookmark, bookmarkExists, getBibleNumberFromName, getBibleTextDir, isMobile, isPowerMode, preloadData, range, removeOnEvents } from '../../../../../lib/util'
import { getBibleChapter, getBibles, getBibleTextBooks, getCommentaries, getSubheadings } from '../../../../../lib/api'
import { _getCommentaryContent, _getDiscourse, _getInstantLex, _getLexicon, _getMorphology, _getSearchTool } from '../../../../../lib/api'
import { useEffect, useRef, useState } from 'react'
import { bibleChapters } from '../../../../../data/bibleChapters'
import { Disclosure } from '@headlessui/react'
import BasicModal from '../../../../../components/basic-modal'
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

const BIBLE_VERSE_POPUP_MENU = "bible-verse-popup-menu"

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const { lang, setLang } = useLang()
  const { theme, setTheme } = useTheme()

  const router = useRouter()
  const text = router.query.text as string
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
  const { show } = useContextMenu({
    id: BIBLE_VERSE_POPUP_MENU
  })
  const scrolledRef = useRef(false)

  const { data: dataBibles, loading: loadingBibles, error: errorBibles } = getBibles()
  const { data: dataBooks, loading: loadingBooks, error: errorBooks } = getBibleTextBooks(text)
  const { data, loading, error } = getBibleChapter(text, bookNum, chapter)
  const { data: dataCommentaries, loading: loadingCommentaries, error: errorCommentaries } = getCommentaries()
  const { data: dataSubheadings, loading: loadingSubheadings, error: errorSubheadings } = getSubheadings(bookNum, chapter)

  let biblesInPopup = []

  const menuTheme = (getTheme() == "dark" ? "dark" : "light")

  if (getLang() == "en") {
    biblesInPopup = ['KJV']
    if (isPowerMode()) {
      biblesInPopup.push.apply(biblesInPopup, ['ESV', 'NASB', 'NIV'])
    }
    biblesInPopup.push.apply(biblesInPopup, ['TRLIT', 'TRLITx', 'KJVx', 'MIB'])
  } else if (getLang().startsWith("zh")) {
    biblesInPopup = ['CUV', 'CUVs', 'KJV', 'KJVx', 'MIB']
  }
  if (!isMobile()) {
    biblesInPopup.push.apply(biblesInPopup, ['MAB'])
  }

  useEffect(() => {
    window.addEventListener('scroll', function (event) { removeToast() });
    const hash = window?.location?.hash
    if (commentary) {
      const element = document.getElementById('commentary-content')
      if (element) {
        element.scrollIntoView()
      }
    } else if (hash) {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        if (!(text == "MAB" || text == "MIB")) {
          element.style.backgroundColor = theme.highlighColor
        }
        window.scrollTo({
          behavior: 'smooth',
          top:
            element.getBoundingClientRect().top -
            document.body.getBoundingClientRect().top - 10,
        })
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
    const targetId = triggerEvent?.srcElement?.id || event.target.id || ''
    const regex = /r(.*)_(.*)/
    const matches = regex.exec(targetId)
    const chapter = matches[1]
    const verse = matches[2]
    if (id == 'copyLink') {
      let url = window.location.protocol + '//' + window.location.host + `/bible/${text}/${book}/${chapter}#v${chapter}_${verse}`
      url = url.replaceAll(" ", "+")
      let contents = url + "\n"
      navigator.clipboard.writeText(contents)
      toast(lang.Copied_to_clipboard)
    } else if (id == 'copyVerse') {
      const verseTextElement = document.getElementById("t" + chapter + "_" + verse)
      let contents = book + " " + chapter + ":" + verse + " (" + text + ")\n"
      contents += verseTextElement.innerText + "\n"
      let url = window.location.protocol + '//' + window.location.host + `/bible/${text}/${book}/${chapter}#v${chapter}_${verse}`
      url = url.replaceAll(" ", "+")
      contents += url + "\n"
      navigator.clipboard.writeText(contents)
      toast(lang.Copied_to_clipboard)
    } else if (id == 'highlight') {
      const element = document.getElementById("v" + chapter + "_" + verse)
      if (element.style.backgroundColor == '') {
        for (const x of Array(150).keys()) {
          const searchElement = "v" + chapter + "_" + (x + 1)
          const element = document.getElementById(searchElement)
          if (!element) break;
          element.style.backgroundColor = ''
        }
        router.push(`/bible/${text}/${book}/${chapter}#v${chapter}_${verse}`)
      } else {
        for (const x of Array(150).keys()) {
          const searchElement = "v" + chapter + "_" + (x + 1)
          const element = document.getElementById(searchElement)
          if (!element) break;
          element.style.backgroundColor = ''
        }
        // router.push(`/bible/${text}/${book}/${chapter}#`)
      }
    } else if (id == 'compare') {
      router.push(`/compare/${book}/${chapter}/${verse}?text=${text}`)
    } else if (id == 'xref') {
      router.push(`/xref/${book}/${chapter}/${verse}/${text}`)
    } else if (id == 'discourse') {
      showDiscourse(bookNum, chapter, verse)
    } else if (id == 'bookmark') {
      const url = `/bible/${text}/${book}/${chapter}#v${chapter}_${verse}`
      if (bookmarkExists(url)) {
        toast(lang.Bookmark_already_exists)
      } else {
        addBookmark(url)
        toast('Bookmark added')
      }
    } else if (id.startsWith("bible")) {
      const bible = id.replace("bible-", "")
      router.push(`/bible/${bible}/${book}/${chapter}#v${chapter}_${verse}`)
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

  function showLexicon(strongs) {
    setModalTitle('Lexicon - ' + strongs)
    _getLexicon('TRLIT', strongs).then((resp) => {
      removeToast()
      const html = resp[0]?.replaceAll('<a href', '<a target="new" href')
      if (!html.includes("[Not found]")) {
        setModalContent(html)
        setShowModal(true)
      } else {
        _getLexicon('SECE', strongs).then((resp) => {
          const html = resp[0]?.replaceAll('<a href', '<a target="new" href')
          setModalContent(html)
          setShowModal(true)
        })
      }
    })
  }

  function showDiscourse(book, chapter, verse) {
    setModalTitle('Discourse')
    _getDiscourse(book, chapter, verse).then((resp) => {
      removeToast()
      let html = resp
      html = removeOnEvents(html)
      console.log(html)
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

  function showMorphology(portion, wordId) {
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

  if (error) return <div>Failed to load</div>
  if (loading) return <div>Loading...</div>

  if (data && dataBooks && dataBibles && dataCommentaries) {

    const mabBible = text == 'MAB'
    const mobBible = text == 'MOB'
    const mibBible = text == 'MIB'
    const mpbBible = text == 'MPB'
    const mtbBible = text == 'MTB'
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
            <Intro currentPage="Bibles" />

            <Disclosure>
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">{lang.Bibles}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataBibles.map((text) => {
                    const hash = window?.location?.hash
                    return (
                      <Link href={"/bible/" + text + "/" + book + "/" + chapter + "?commentary=" + hash}>
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
                <div className="text-2xl">{text}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {bookNames.map((book) => (
                    <Link href={"/bible/" + text + "/" + book + "/1?commentary="}>
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
                {chapters.map((chapter) => (
                  <Link href={"/bible/" + text + "/" + book + "/" + chapter + "?commentary="}>
                    <button className={`${theme.clickableButton}`}>{chapter}</button>
                  </Link>
                ))}
              </Disclosure.Panel>
            </Disclosure>

            <div className="flex justify-center items-center mt-2 mb-5">
              {showPrevious &&
                <Link href={"/bible/" + text + '/' + book + '/' + (parseInt(chapter) - 1)}>
                  <button className={`${theme.clickableButton}`}>{lang.Previous}</button></Link>}
              {showNext &&
                <Link href={"/bible/" + text + '/' + book + '/' + (parseInt(chapter) + 1)}>
                  <button className={`${theme.clickableButton}`}>{lang.Next}</button></Link>}
            </div>

            <div dir={textDir} className={`${theme.bibleDivContainer}`}>
              {(mabBible || mibBible || mtbBible || mpbBible) &&
                data.map((verse) => {
                  let text = verse.t
                  text = text.replaceAll(/<vid.*?<\/vid>/g, "")
                  text = text.replaceAll(/^(<br>)*/g, "")
                  text = text.replaceAll(/onclick=".*?"/g, "")
                  text = text.replaceAll(/ondblclick=".*?"/g, "")
                  text = text.replaceAll(/onmouseover=".*?"/g, "")
                  text = text.replaceAll(/onmouseout=".*?"/g, "")
                  return (
                    <p id={`v${verse.c}_${verse.v}`}>
                      <span className={`${theme.bibleReferenceContainer}`} onClick={displayMenu} id={`r${verse.c}_${verse.v}`}>{verse.c}:{verse.v}</span>
                      {(mtbBible || mpbBible) && <br />}
                      <span id={`t${verse.c}_${verse.v}`} className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: text }} /></p>
                  )
                })
              }
              {mobBible &&
                data.map((verse) => {
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
                    <>
                      <p id={`v${verse.c}_${verse.v}`}>
                        <span id={`r${verse.c}_${verse.v}`} className={`${theme.bibleReferenceContainer}`} onClick={displayMenu} onMouseEnter={() => removeToast()}>{verse.c}:{verse.v} - </span>
                        <span className={`${theme.bibleTextContainer}`}>
                          {verseContent.map((data) => (
                            <span onMouseEnter={() => instantMorphology(data[0], data[1])} onMouseLeave={() => removeToast()} onClick={() => showMorphology(data[0], data[1])} className="hover:cursor-pointer">{data[2]}</span>
                          ))}
                        </span>
                      </p>
                    </>
                  )
                }
                )
              }
              {rawVerse &&
                data.map((verse) => (verse.t &&
                  <>
                  {renderSubheadings(`${verse.v}`)}
                  <p id={`v${verse.c}_${verse.v}`}>
                    <span className={`${theme.bibleReferenceContainer}`} onClick={displayMenu} id={`r${verse.c}_${verse.v}`}>{verse.c}:{verse.v} - </span>
                    <span id={`t${verse.c}_${verse.v}`} className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: verse.t }} />
                  </p>
                  </>
                ))
              }
              {parseVerse &&
                data.map((verse) => (verse.t &&
                  <p id={`v${verse.c}_${verse.v}`}>
                    <span className={`${theme.bibleReferenceContainer}`} onClick={displayMenu} id={`r${verse.c}_${verse.v}`}>{verse.c}:{verse.v} - </span>
                    {verse.t.split(' ').map((word) => (
                      word.match(/[GH][0-9]{1,4}/) ?
                        <a className={`${theme.textStrongs}`} onMouseEnter={() => instantLexicon(word)} onMouseLeave={() => removeToast()} onClick={() => showLexicon(word)}>{word} </a>
                        : <span className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: word + " " }} />
                    ))}
                  </p>
                ))
              }

            </div>

            <div className="flex justify-center items-center mt-2 mb-5">
              {showPrevious &&
                <Link href={"/bible/" + text + '/' + book + '/' + (parseInt(chapter) - 1)}>
                  <button className={`${theme.clickableButton}`}>{lang.Previous}</button></Link>}
              {showNext &&
                <Link href={"/bible/" + text + '/' + book + '/' + (parseInt(chapter) + 1)}>
                  <button className={`${theme.clickableButton}`}>{lang.Next}</button></Link>}
            </div>

            <Disclosure>
              <Disclosure.Button className={`${theme.chapterDisclosure}`}>
                <div className="text-xl">{lang.Commentaries}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataCommentaries.map((commentary) => (
                    <Link href={"/commentary/" + commentary + '/' + book + '/' + chapter + '?text=' + text}>
                      <button className={`${theme.clickableButton}`}>
                        {commentary.replaceAll('_', ' ')}
                      </button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <BasicModal show={showModal} setter={setShowModal} title={modalTitle} content={modalContent}></BasicModal>

            <Menu id={BIBLE_VERSE_POPUP_MENU} theme={menuTheme}>
              <Item id="bookmark" onClick={handleItemClick}><span className="text-md">{lang.Add_bookmark}</span></Item>
              <Item id="highlight" onClick={handleItemClick}><span className="text-md">{lang.Toggle_highlight}</span></Item>
              <Item id="copyVerse" onClick={handleItemClick}><span className="text-md">{lang.Copy_verse}</span></Item>
              <Item id="copyLink" onClick={handleItemClick}><span className="text-md">{lang.Copy_link}</span></Item>
              <Item id="xref" onClick={handleItemClick}><span className="text-md">{lang.Cross_references}</span></Item>
              <Item id="compare" onClick={handleItemClick}><span className="text-md">{lang.Compare}</span></Item>
              {!isMobile() && <Item id="discourse" onClick={handleItemClick}><span className="text-md">{lang.Discourse}</span></Item>}
              {!isMobile() && <Separator />}
              {biblesInPopup.map((bible) => {
                const bibleId = "bible-" + bible
                return <Item id={bibleId} onClick={handleItemClick}><span className="text-md">{bible}</span></Item>
              })
              }
              {bookNum < 40 && <Item id="bible-Tanakhxx" onClick={handleItemClick}><span className="text-md">Tanakhxx</span></Item>}
              <Item id="bible-Greek+" onClick={handleItemClick}><span className="text-md">Greek+</span></Item>
            </Menu>

          </Container>
        </Layout>
      </>
    )
  }
}

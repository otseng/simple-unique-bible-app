import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../../lib/constants'
import { addBookmark, bookmarkExists, getBibleTextDir, preloadData, range } from '../../../../../lib/util'
import { getBibleChapter, getBibles, getBibleTextBooks, getCommentaries, _getCommentaryContent, _getInstantLex, _getLexicon, _getMorphology } from '../../../../../lib/api'
import { useEffect, useRef, useState } from 'react'
import { chapterDisclosure, clickableButton, homeDisclosure, textStrongs } from '../../../../../lib/styles'
import { bibleChapters } from '../../../../../data/bibleChapters'
import { Disclosure } from '@headlessui/react'
import BasicModal from '../../../../../components/basic-modal'
import {
  Menu,
  Item,
  Separator,
  useContextMenu
} from "react-contexify"
import "react-contexify/dist/ReactContexify.css"
import { toast } from 'react-hot-toast'

const BIBLE_VERSE_POPUP_MENU = "bible-verse-popup-menu"

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const text = router.query.text as string
  const book = router.query.book as string
  const bookNum = globalThis.bibleNameToNumber[book]
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
  const scrolledRef = useRef(false);

  const { data: dataBibles, loading: loadingBibles, error: errorBibles } = getBibles()
  const { data: dataBooks, loading: loadingBooks, error: errorBooks } = getBibleTextBooks(text)
  const { data, loading, error } = getBibleChapter(text, bookNum, chapter)
  const { data: dataCommentaries, loading: loadingCommentaries, error: errorCommentaries } = getCommentaries()

  useEffect(() => {
    const hash = window?.location?.hash
    if (commentary) {
      const element = document.getElementById('commentary-content')
      if (element) {
        element.scrollIntoView();
      }
    } else if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.style.backgroundColor = 'lightgoldenrodyellow'
        // if (!scrolledRef.current) {
        element.scrollIntoView({ behavior: 'smooth' });
        scrolledRef.current = true;
        // }
      }
    }
  });

  function handleItemClick({ id, event, props, data, triggerEvent }) {
    console.log(id, event, triggerEvent)
    const targetId = triggerEvent?.srcElement?.id || ''
    const regex = /t(.*)_(.*)/
    const matches = regex.exec(targetId)
    const chapter = matches[1]
    const verse = matches[2]
    if (id == 'copy') {
      const url = window.location.protocol + '//' + window.location.host + `/bible/${text}/${book}/${chapter}#v${chapter}_${verse}`
      navigator.clipboard.writeText(url)
      toast('Link copied to clipboard')
    } else if (id == 'highlight') {
      const element = document.getElementById("v" + chapter + "_" + verse);
      if (element.style.backgroundColor !== 'lightgoldenrodyellow') {
        router.push(`/bible/${text}/${book}/${chapter}#v${chapter}_${verse}`)
      } else {
        element.style.backgroundColor = ''
      }
    } else if (id == 'compare') {
      router.push(`/compare/${book}/${chapter}/${verse}?text=${text}`)
    } else if (id == 'xref') {
      router.push(`/xref/${book}/${chapter}/${verse}/${text}`)
    } else if (id == 'bookmark') {
      const url = `/bible/${text}/${book}/${chapter}#v${chapter}_${verse}`
      if (bookmarkExists(url)) {
        toast('Bookmark already exists')
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
    show({
      event: e,
    })
  }

  function showLexicon(strongs) {
    removeToast()
    setModalTitle('Lexicon - ' + strongs)
    _getLexicon('TRLIT', strongs).then((resp) => {
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

  function instantLexicon(strongs) {
    if ((typeof window !== 'undefined') && window.innerWidth > 820) {
      _getInstantLex(strongs).then((resp) => {
        if (resp) {
          const info = strongs + " • " + resp[0] + " • " + resp[1] + " • " + resp[2] + " • " + resp[3]
          toast(info, { duration: 5000 })
        }
      })
    }
  }

  function showMorphology(portion, wordId) {
    removeToast()
    _getMorphology(portion, wordId).then((resp) => {
      const html = resp[5] + " • " + resp[7] + " • " + resp[8] + "<br/>" + resp[4]
      setModalTitle('Morphology - ' + resp[1])
      setModalContent(html)
      setShowModal(true)
    }
    )
  }

  function instantMorphology(portion, wordId) {
    if ((typeof window !== 'undefined') && window.innerWidth > 820) {
      _getMorphology(portion, wordId).then((resp) => {
        if (resp) {
          const definition = resp[7] || ''
          const info = resp[1] + " • " + resp[5] + " • " + definition + "\n" + resp[4].replaceAll(",", ", ")
          toast(info, { duration: 10000 })
        }
      })
    }
  }

  function removeToast() {
    toast.dismiss();
  }

  if (error) return <div>Failed to load</div>
  if (loading) return <div>Loading...</div>

  if (data && dataBooks && dataBibles && dataCommentaries) {

    const mobBible = text == 'MOB'
    const mibBible = text == 'MIB'
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
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">Bibles</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataBibles.map((text) => {
                    const hash = window?.location?.hash
                    return (
                      <Link href={"/bible/" + text + "/" + book + "/" + chapter + "?commentary=" + hash}>
                        <button className={`${clickableButton}`}>{text}</button>
                      </Link>
                    )
                  }
                  )}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">{text}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {bookNames.map((book) => (
                    <Link href={"/bible/" + text + "/" + book + "/1?commentary="}>
                      <button className={`${clickableButton}`}>{book}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${chapterDisclosure}`}>
                <div className="text-xl">{book} {chapter}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                {chapters.map((chapter) => (
                  <Link href={"/bible/" + text + "/" + book + "/" + chapter + "?commentary="}>
                    <button className={`${clickableButton}`}>{chapter}</button>
                  </Link>
                ))}
              </Disclosure.Panel>
            </Disclosure>

            <div dir={textDir}>
              {mobBible &&
                data.map((verse) => {
                  let verseContent = []
                  let text = verse.t
                  const type = bookNum < 40 ? 'heb' : 'grk'
                  let words = text.matchAll(new RegExp("<" + type + ".*?</" + type + ">", "g"))
                  words = Array.from(words)
                  for (const word of words) {
                    // console.log(word[0])
                    let portion = ''
                    let wordId = ''
                    let regex = new RegExp("searchWord[(](.*?),(.*?)[)]")
                    let matches = regex.exec(word[0])
                    if (matches) {
                      portion = matches[1]
                      wordId = matches[2]
                      console.log(portion + ":" + wordId)
                    }
                    regex = new RegExp("<" + type + ".*?>(.*?)</" + type + ">")
                    matches = regex.exec(word[0])
                    console.log(matches[1])
                    let aword = matches[1].replace("<pm>", "").replace("</pm>", "")
                    if (type == 'grk') aword = aword + ' '
                    verseContent.push([portion, wordId, aword])
                  }
                  return (
                    <>
                      <p id={`v${verse.c}_${verse.v}`}>
                        <span id={`t${verse.c}_${verse.v}`} className="hover:cursor-pointer" onClick={displayMenu} onMouseEnter={() => removeToast()}>{verse.c}:{verse.v} - </span>
                        {verseContent.map((data) => (
                          <span onMouseEnter={() => instantMorphology(data[0], data[1])} onMouseLeave={() => removeToast()} onClick={() => showMorphology(data[0], data[1])} className="hover:cursor-pointer">{data[2]}</span>
                        ))}
                      </p>
                    </>
                  )
                }
                )
              }
              {rawVerse &&
                data.map((verse) => (verse.t &&
                  <p id={`v${verse.c}_${verse.v}`}>
                    <span className="hover:cursor-pointer" onClick={displayMenu} id={`t${verse.c}_${verse.v}`}>{verse.c}:{verse.v} - </span>
                    <span className="text-container" dangerouslySetInnerHTML={{ __html: verse.t }} /></p>
                ))
              }
              {parseVerse &&
                data.map((verse) => (verse.t &&
                  <p id={`v${verse.c}_${verse.v}`}>
                    <span className="hover:cursor-pointer" onClick={displayMenu} id={`t${verse.c}_${verse.v}`}>{verse.c}:{verse.v} - </span>
                    {verse.t.split(' ').map((word) => (
                      word.match(/[GH][0-9]{1,4}/) ?
                        <a className={`${textStrongs}`} onMouseEnter={() => instantLexicon(word)} onMouseLeave={() => removeToast()} onClick={() => showLexicon(word)}>{word} </a>
                        : <span dangerouslySetInnerHTML={{ __html: word + " " }} />
                    ))}
                  </p>
                ))
              }

            </div>

            <div className="flex justify-center items-center mt-2 mb-5">
              {showPrevious &&
                <Link href={"/bible/" + text + '/' + book + '/' + (parseInt(chapter) - 1)}>
                  <button className={`${clickableButton}`}>Previous</button></Link>}
              {showNext &&
                <Link href={"/bible/" + text + '/' + book + '/' + (parseInt(chapter) + 1)}>
                  <button className={`${clickableButton}`}>Next</button></Link>}
            </div>

            <Disclosure>
              <Disclosure.Button className={`${chapterDisclosure}`}>
                <div className="text-xl">Commentaries</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataCommentaries.map((commentary) => (
                    <Link href={"/commentary/" + commentary + '/' + book + '/' + chapter + '?text=' + text}>
                      <button className={`${clickableButton}`}>
                        {commentary.replaceAll('_', ' ')}
                      </button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <BasicModal show={showModal} setter={setShowModal} title={modalTitle} content={modalContent}></BasicModal>

            <Menu id={BIBLE_VERSE_POPUP_MENU}>
              <Item id="bookmark" onClick={handleItemClick}><span className="text-md">Add bookmark</span></Item>
              <Item id="highlight" onClick={handleItemClick}><span className="text-md">Toggle highlight</span></Item>
              <Item id="copy" onClick={handleItemClick}><span className="text-md">Copy link</span></Item>
              <Item id="xref" onClick={handleItemClick}><span className="text-md">Cross references</span></Item>
              <Item id="compare" onClick={handleItemClick}><span className="text-md">Compare</span></Item>
              <Separator />
              <Item id="bible-KJV" onClick={handleItemClick}><span className="text-md">KJV</span></Item>
              <Item id="bible-NET" onClick={handleItemClick}><span className="text-md">NET</span></Item>
              <Item id="bible-NET" onClick={handleItemClick}><span className="text-md">WEB</span></Item>
              <Item id="bible-TRLIT" onClick={handleItemClick}><span className="text-md">TRLIT</span></Item>
              <Item id="bible-TRLITx" onClick={handleItemClick}><span className="text-md">TRLITx</span></Item>
              <Item id="bible-KJVx" onClick={handleItemClick}><span className="text-md">KJVx</span></Item>
              <Item id="bible-MOB" onClick={handleItemClick}><span className="text-md">MOB</span></Item>
              <Item id="bible-Tanakhxx" onClick={handleItemClick}><span className="text-md">Tanakhxx</span></Item>
              <Item id="bible-Greek+" onClick={handleItemClick}><span className="text-md">Greek+</span></Item>
            </Menu>

          </Container>
        </Layout>
      </>
    )
  }
}
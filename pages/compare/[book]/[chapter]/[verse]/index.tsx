import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../../lib/constants'
import { getBibleNumberFromName, getBibleTextDir, preloadData, range } from '../../../../../lib/util'
import { getBibleBooks, getCompareVerses, _getLexicon } from '../../../../../lib/api'
import { Disclosure } from '@headlessui/react'
import { bibleChapters } from '../../../../../data/bibleChapters'
import { bibleChapterVerses } from '../../../../../data/bibleChapterVerses'
import BasicModal from '../../../../../components/basic-modal'
import { useState } from 'react'
import { useLang } from '../../../../../lang/langContext'
import { useTheme } from '../../../../../theme/themeContext'

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  if (!globalThis.bibleBooks) preloadData()

  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')

  const router = useRouter()
  let book = router.query.book as string
  const chapter = router.query.chapter as string
  const verse = router.query.verse as string
  let text = router.query.text as string
  if (!text) {
    text = "KJV"
  }
  const bookNum = getBibleNumberFromName(book)
  const chapters = range(bibleChapters[bookNum], 1)
  const verseList = bibleChapterVerses[bookNum]
  const verses = (chapter && verseList) ? range(verseList[chapter], 1) : []

  const { data: texts, loading, error } = getBibleBooks()
  const { data: dataVerses, loading: loadingVerses, error: errorVerses } = getCompareVerses(bookNum, chapter, verse)

  async function getStaticProps({ params: {slug} }) {
  }

  function showLexicon(strongs) {
    setModalTitle('Lexicon - ' + strongs)
    const data = _getLexicon('TRLIT', strongs).then((resp) => {
      const html = resp[0]?.replaceAll('<a href', '<a target="new" href')
      setModalContent(html)
      setShowModal(true)
    })
  }

  if (error || errorVerses) return <div>Failed to load</div>
  if (loadingVerses) return <div className={`${theme.bibleReferenceContainer}`}>Loading...</div>

  if (texts && dataVerses) {
    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="Compare" />

            <Disclosure>
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">{lang.Compare}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {globalThis.bookNames.map((book) => (
                    <Link href={"/compare/" + book}>
                      <button className={`${theme.clickableButton}`}>{book}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">{book}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {chapters.map((chapter) => (
                    <Link href={"/compare/" + book + "/" + chapter}>
                      <button className={`${theme.clickableButton}`}>{chapter}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">{lang.Chapter} {chapter}:{verse}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {verses.map((verse) => (
                    <Link href={"/compare/" + book + "/" + chapter + "/" + verse}>
                      <button className={`${theme.clickableButton}`}>{verse}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <div>
              {dataVerses.map((data) => {
                const verseStr = data[1][3]
                const text = data[0]
                const dir = getBibleTextDir(text, bookNum)
                if (verseStr) {
                  const link = <Link className={`${theme.bibleReferenceContainer}`} href={"/bible/" + data[0] + "/" + book + "/" + chapter + "#v" + chapter + "_" + verse}>({data[0]}) {data[1][1]}:{data[1][2]}</Link>
                  if (text.endsWith('+') || text.endsWith('x')) {
                    const parsed = verseStr.split(' ').map((word) => (
                      word.match(/[GH][0-9]{1,4}/) ?
                        <sup><a className={`${theme.textStrongs}`} onClick={() => showLexicon(word)}>{word} </a></sup>
                        : <span className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: word + " " }} />
                    ))
                    return (<p className={`${theme.bibleDivContainer}`} dir={dir}>{link} - {parsed}</p>)
                  } else {
                    return (<p className={`${theme.bibleDivContainer}`} dir={dir}>{link} - <span className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: verseStr }} /></p>)
                  }
                }
              })
              }
            </div>

            <div className="flex justify-center items-center">
              <Link href={"/bible/" + text + "/" + book + "/" + chapter + "#v" + chapter + "_" + verse}>
                <button className={`${theme.clickableButton}`}>{lang.Return_to} {book} {chapter}:{verse}</button>
              </Link>
            </div>

            <BasicModal show={showModal} setter={setShowModal} title={modalTitle} content={modalContent}></BasicModal>

          </Container>
        </Layout>
      </>
    )
  }
}


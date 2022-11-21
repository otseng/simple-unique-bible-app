import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../../lib/constants'
import { preloadData, range } from '../../../../../lib/util'
import { clickableButton, homeDisclosure, textStrongs } from '../../../../../lib/styles'
import { getBibleBooks, getBibles, getBibleTextBooks, getCompareVerses, getLexicon } from '../../../../../lib/api'
import { Disclosure } from '@headlessui/react'
import { bibleChapters } from '../../../../../data/bibleChapters'
import { bibleChapterVerses } from '../../../../../data/bibleChapterVerses'
import BasicModal from '../../../../../components/basic-modal'
import { useState } from 'react'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')

  const router = useRouter()
  const book = router.query.book as string
  const chapter = router.query.chapter as string
  const verse = router.query.verse as string
  const bookNum = globalThis.bibleNameToNumber[book]
  const chapters = range(bibleChapters[bookNum], 1)
  const verseList = bibleChapterVerses[bookNum]
  const verses = (chapter && verseList) ? range(verseList[chapter], 1) : []

  const { data: texts, loading, error } = getBibleBooks()
  const { data: dataVerses, loading: loadingVerses, error: errorVerses } = getCompareVerses(bookNum, chapter, verse)

  function showLexicon(strongs) {
    setModalTitle('Lexicon - ' + strongs)
    const data = getLexicon('TRLIT', strongs).then((resp) => {
      const html = resp[0]?.replaceAll('<a href', '<a target="new" href')
      setModalContent(html)
      setShowModal(true)
    })
  }

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (texts && dataVerses) {
    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="true" />

            <Disclosure>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">Compare</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {globalThis.bookNames.map((book) => (
                    <Link href={"/compare/" + book}>
                      <button className={`${clickableButton}`}>{book}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">{book}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {chapters.map((chapter) => (
                    <Link href={"/compare/" + book + "/" + chapter}>
                      <button className={`${clickableButton}`}>{chapter}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">Chapter {chapter}:{verse}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {verses.map((verse) => (
                    <Link href={"/compare/" + book + "/" + chapter + "/" + verse}>
                      <button className={`${clickableButton}`}>{verse}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <div>
              {dataVerses.map((data) => {
                const verseStr = data[1][3]
                if (verseStr) {
                  if (data[0].endsWith('+') || data[0].endsWith('x')) {
                    return( 
                      verseStr.split(' ').map((word) => (
                      word.match(/[GH][0-9]{1,4}/) ?
                        <sup><a className={`${textStrongs}`} onClick={() => showLexicon(word)}>{word} </a></sup>
                        : <span dangerouslySetInnerHTML={{ __html: word + " " }} />
                    ))
                    )
                  } else {
                    return (<p>({data[0]}) {data[1][1]}:{data[1][2]} -  <span className="text-container" dangerouslySetInnerHTML={{ __html: verseStr }} /></p>)
                  }
                }
              })
              }
            </div>

            <BasicModal show={showModal} setter={setShowModal} title={modalTitle} content={modalContent}></BasicModal>

          </Container>
        </Layout>
      </>
    )
  }
}


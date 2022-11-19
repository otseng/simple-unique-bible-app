import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../../lib/constants'
import { preloadData, range, scrollToTop } from '../../../../../lib/util'
import { getBibleChapter, getBibles, getBibleTextBooks, getLexicon } from '../../../../../lib/api'
import { useEffect, useState } from 'react'
import { chapterDisclosure, clickableButton, homeDisclosure, textStrongs } from '../../../../../lib/styles'
import { bibleChapters } from '../../../../../data/bibleChapters'
import { Disclosure } from '@headlessui/react'
import BasicModal from '../../../../../components/basic-modal'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const text = router.query.text as string
  const book = router.query.book as string
  const bookNum = globalThis.bibleNameToNumber[book]
  const chapter = router.query.chapter as string
  const showPrevious = parseInt(chapter) > 1
  const showNext = parseInt(chapter) < bibleChapters[bookNum]
  const chapters = range(bibleChapters[bookNum], 1)

  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')

  const { data: dataBibles, loading: loadingBibles, error: errorBibles } = getBibles()
  const { data: dataBooks, loading: loadingBooks, error: errorBooks } = getBibleTextBooks(text)
  const { data, loading, error } = getBibleChapter(text, bookNum, chapter)

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowScrollToTopButton(true);
      } else {
        setShowScrollToTopButton(false);
      }
    });
  }, []);

  function showLexicon(strongs) {
    setModalTitle('Lexicon - ' + strongs)
    const data = getLexicon('TRLIT', strongs).then((data) => {
      setModalContent(data)
      setShowModal(true)
    })
  }

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (data && dataBooks && dataBibles) {

    const parseVerse = text.endsWith('x') || false
    const bookNames = dataBooks.map((number) => globalThis.bibleNumberToName[number])

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
                <div className="text-2xl">Bibles</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataBibles.map((text) => (
                    <Link href={"/bible/" + text + "/" + book + "/" + chapter}>
                      <button className={`${clickableButton}`}>{text}</button>
                    </Link>
                  ))}
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
                    <Link href={"/bible/" + text + "/" + book + "/1"}>
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
                  <Link href={"/bible/" + text + "/" + book + "/" + chapter}>
                    <button className={`${clickableButton}`}>{chapter}</button>
                  </Link>
                ))}
              </Disclosure.Panel>
            </Disclosure>

            <p>&nbsp;</p>
            {!parseVerse &&
              data.map((verse) => (verse.t &&
                <p id={`v${verse.c}_${verse.v}`}>{verse.c}:{verse.v} - <span className="text-container" dangerouslySetInnerHTML={{ __html: verse.t }} /></p>
              ))
            }
            {parseVerse &&
              data.map((verse) => (verse.t &&
                <p id={`v${verse.c}_${verse.v}`}>{verse.c}:{verse.v}<span> - </span>
                  {verse.t.split(' ').map((word) => (
                    word.match(/[GH][0-9]{1,4}/) ?
                      <sup><a className={`${textStrongs}`} onClick={() => showLexicon(word)}>{word} </a></sup>
                      : <span dangerouslySetInnerHTML={{ __html: word + " " }} />
                  ))}
                </p>
              ))
            }

            {showPrevious &&
              <Link href={"/bible/" + text + '/' + book + '/' + (parseInt(chapter) - 1)}>
                <button className={`${clickableButton}`}>Previous</button></Link>}
            {showNext &&
              <Link href={"/bible/" + text + '/' + book + '/' + (parseInt(chapter) + 1)}>
                <button className={`${clickableButton}`}>Next</button></Link>}

            <BasicModal show={showModal} setter={setShowModal} title={modalTitle} content={modalContent}></BasicModal>

            {showScrollToTopButton && (
              <button onClick={scrollToTop} className="back-to-top">
                &#8679;
              </button>
            )}
          </Container>
        </Layout>
      </>
    )
  }
}
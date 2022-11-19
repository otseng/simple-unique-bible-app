import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../../lib/constants'
import { preloadData, range, scrollToTop } from '../../../../../lib/util'
import { getBibleChapter, getLexicon } from '../../../../../lib/api'
import { useEffect, useState } from 'react'
import { chapterDisclosure, clickableButton, textStrongs } from '../../../../../lib/styles'
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
  

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowScrollToTopButton(true);
      } else {
        setShowScrollToTopButton(false);
      }
    });
  }, []);

  const { data, loading, error } = getBibleChapter(text, bookNum, chapter)

  function showLexicon(strongs) {
    setModalTitle('Lexicon - ' + strongs)
    const data = getLexicon('TRLIT', strongs).then((data) => {
      setModalContent(data)
      setShowModal(true)
    })
  }

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (data) {

    const parseVerse = text.endsWith('x') || false

    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="true" />
            <h1 className="text-l font-bold"><Link href={"/bible/" + text}>
              <button className={`${clickableButton}`}>{text}</button></Link></h1>

            <Disclosure>
            <Disclosure.Button className={`${chapterDisclosure}`}>
              <div>Chapter {chapter}</div>
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
              data.map((verse) => ( verse.t &&
                <p id={`v${verse.c}_${verse.v}`}>{verse.c}:{verse.v} - <span className="text-container" dangerouslySetInnerHTML={{ __html: verse.t }} /></p>
              ))
            }
            {parseVerse &&
              data.map((verse) => ( verse.t &&
                <p id={`v${verse.c}_${verse.v}`}>{verse.c}:{verse.v}<span> - </span> 
                  {verse.t.split(' ').map((word) => (
                    word.match(/[GH][0-9]{1,4}/) ?
                    <sup><a href="#" className={`${textStrongs}`} onClick={() => showLexicon(word)}>{word} </a></sup>
                    : <span>{word} </span>
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
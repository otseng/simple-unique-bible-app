import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../../lib/constants'
import { preloadData, range, scrollToTop } from '../../../../../lib/util'
import { getBibleChapter } from '../../../../../lib/api'
import { Spinner } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { chapterDisclosure, clickableButton } from '../../../../../lib/styles'
import { bibleChapters } from '../../../../../data/bibleChapters'
import { Disclosure } from '@headlessui/react'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const text = router.query.text
  const book = router.query.book as string
  const bookNum = globalThis.bibleNameToNumber[book]
  const chapter = router.query.chapter as string
  const showPrevious = parseInt(chapter) > 1
  const showNext = parseInt(chapter) < bibleChapters[bookNum]
  const chapters = range(bibleChapters[bookNum], 1)

  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

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

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (data) {
    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro showHome="true" />
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
            {
              data.map((verse) => (
                <p>{verse.c}:{verse.v} - <span className="text-container" dangerouslySetInnerHTML={{ __html: verse.t }} /></p>
              ))
            }

            {showPrevious &&
              <Link href={"/bible/" + text + '/' + book + '/' + (parseInt(chapter) - 1)}>
                <button className={`${clickableButton}`}>Previous</button></Link>}
            {showNext &&
              <Link href={"/bible/" + text + '/' + book + '/' + (parseInt(chapter) + 1)}>
                <button className={`${clickableButton}`}>Next</button></Link>}

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
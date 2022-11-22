import Container from '../../../../../../components/container'
import Intro from '../../../../../../components/intro'
import Layout from '../../../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../../../lib/constants'
import { preloadData, range } from '../../../../../../lib/util'
import { clickableButton, homeDisclosure, textStrongs } from '../../../../../../lib/styles'
import { getBibleBooks, getCrossReferences } from '../../../../../../lib/api'
import { Disclosure } from '@headlessui/react'
import { bibleChapters } from '../../../../../../data/bibleChapters'
import { bibleChapterVerses } from '../../../../../../data/bibleChapterVerses'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const book = router.query.book as string
  const chapter = router.query.chapter as string
  const verse = router.query.verse as string
  const text = router.query.text as string
  const bookNum = globalThis.bibleNameToNumber[book]
  const chapters = range(bibleChapters[bookNum], 1)
  const verseList = bibleChapterVerses[bookNum]
  const verses = (chapter && verseList) ? range(verseList[chapter], 1) : []

  const { data: dataVerses, loading: loadingVerses, error: errorVerses } = getCrossReferences(bookNum, chapter, verse, text)

  if (errorVerses) return <div>Failed to load</div>
  if (loadingVerses) return <div>Loading</div>

  if (dataVerses) {
    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="Cross Reference" />

            <Disclosure>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">Cross Reference</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {globalThis.bookNames.map((book) => (
                    <Link href={"/xref/" + book}>
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
                    <Link href={"/xref/" + book + "/" + chapter}>
                      <button className={`${clickableButton}`}>{chapter}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">{book} {chapter}:{verse}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {verses.map((verse) => (
                    <Link href={"/xref/" + book + "/" + chapter + "/" + verse + "/" + text}>
                      <button className={`${clickableButton}`}>{verse}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <div>
              {dataVerses.map((data) => {
                const bookName = globalThis.bibleNumberToName[data[0]]
                const chapt = data[1]
                const verse = data[2]
                const dir = (bookNum < 40 && (text == 'Tanakhxx' || text.startsWith('OHGB') || text == "MOB")) ? 'rtl' : 'ltr'
                const link = <Link href={"/bible/" + text + "/" + bookName + "/" + chapt + "#v" + chapt + "_" + verse}>{bookName} {data[1]}:{data[2]}</Link>
                return (<p dir={dir} className="mt-2">{link} - {data[3]}</p>)
              })
            } 
            </div>

          </Container>
        </Layout>
      </>
    )
  }
}


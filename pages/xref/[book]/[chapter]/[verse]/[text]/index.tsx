import Container from '../../../../../../components/container'
import Intro from '../../../../../../components/intro'
import Layout from '../../../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../../../lib/constants'
import { getBibleNumberFromName, getBibleTextDir, preloadData, range } from '../../../../../../lib/util'
import { getCrossReferences } from '../../../../../../lib/api'
import { Disclosure } from '@headlessui/react'
import { bibleChapters } from '../../../../../../data/bibleChapters'
import { bibleChapterVerses } from '../../../../../../data/bibleChapterVerses'
import { useLang } from '../../../../../../lang/langContext'
import { useTheme } from '../../../../../../theme/themeContext'

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const book = router.query.book as string
  const chapter = router.query.chapter as string
  const verse = router.query.verse as string
  const text = router.query.text as string
  const bookNum = getBibleNumberFromName(book)
  const chapters = range(bibleChapters[bookNum], 1)
  const verseList = bibleChapterVerses[bookNum]
  const verses = (chapter && verseList) ? range(verseList[chapter], 1) : []

  const { data: dataVerses, loading: loadingVerses, error: errorVerses } = getCrossReferences(bookNum, chapter, verse, text)

  if (errorVerses) return <div>Failed to load</div>
  if (loadingVerses) return <div>Loading...</div>

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
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">{lang.Cross_reference}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {globalThis.bookNames.map((book) => (
                    <Link href={"/xref/" + book}>
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
                    <Link href={"/xref/" + book + "/" + chapter}>
                      <button className={`${theme.clickableButton}`}>{chapter}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">{book} {chapter}:{verse}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {verses.map((verse) => (
                    <Link href={"/xref/" + book + "/" + chapter + "/" + verse + "/" + text}>
                      <button className={`${theme.clickableButton}`}>{verse}</button>
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
                const dir = getBibleTextDir(text, bookNum)
                const verseText = data[3]
                const link = <Link className={`${theme.bibleReferenceContainer}`} href={"/bible/" + text + "/" + bookName + "/" + chapt + "#v" + chapt + "_" + verse}>{bookName} {data[1]}:{data[2]}</Link>
                return (<p dir={dir} className={`${theme.bibleDivContainer}`}>{link} - <span className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: verseText }} /></p>)
              })
              }
            </div>

            <div className="flex justify-center items-center">
              <Link href={"/bible/" + text + "/" + book + "/" + chapter + "#v" + chapter + "_" + verse}>
                <button className={`${theme.clickableButton}`}>Return to {book} {chapter}:{verse}</button>
              </Link>
            </div>

          </Container>
        </Layout>
      </>
    )
  }
}


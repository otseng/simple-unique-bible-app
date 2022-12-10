import Container from '../../../../components/container'
import Intro from '../../../../components/intro'
import Layout from '../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../lib/constants'
import { getBibleNumberFromName, preloadData, range } from '../../../../lib/util'
import { bibleChapters } from '../../../../data/bibleChapters'
import { clickableButton, homeDisclosure, nonclickableButton } from '../../../../lib/styles'
import { getCommentaries } from '../../../../lib/api'
import { Disclosure } from '@headlessui/react'
import { useLang } from '../../../../lang/langContext'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const {lang, setLang} = useLang()
  const router = useRouter()
  const title = router.query.title
  const book = router.query.book as string
  const bookNum = getBibleNumberFromName(book)
  const chapters = range(bibleChapters[bookNum], 1)

  const { data: dataCommentaries, loading: loadingCommentaries, error: errorCommentaries } = getCommentaries()

  if (dataCommentaries) {
    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="Commentaries" />

            <Disclosure>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">{lang.Commentaries}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataCommentaries.map((commentary) => (
                    <Link href={"/commentary/" + commentary}>
                      <button className={`${clickableButton}`}>
                        {commentary.replaceAll('_', ' ')}
                      </button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">{title}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {globalThis.bookNames.map((book) => (
                    <Link href={"/commentary/" + title + "/" + book}>
                      <button className={`${clickableButton}`}>{book}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure defaultOpen>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">{book}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {chapters.map((chapter) => (
                    <Link href={"/commentary/" + title + '/' + book + '/' + chapter}>
                      <button className={`${clickableButton}`}>{chapter}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>


          </Container>
        </Layout>
      </>
    )
  }
}


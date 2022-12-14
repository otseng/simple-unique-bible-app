import Container from '../../../components/container'
import Intro from '../../../components/intro'
import Layout from '../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../lib/constants'
import { getBibleNumberFromName, preloadData, range } from '../../../lib/util'
import { Disclosure } from '@headlessui/react'
import { bibleChapters } from '../../../data/bibleChapters'
import { useLang } from '../../../lang/langContext'
import { useTheme } from '../../../theme/themeContext'

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const text = router.query.text
  const book = router.query.book as string
  const bookNum = getBibleNumberFromName(book)
  const chapters = range(bibleChapters[bookNum], 1)

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

          <Disclosure defaultOpen>
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

        </Container>
      </Layout>
    </>
  )
}

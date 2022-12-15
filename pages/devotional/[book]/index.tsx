import Container from '../../../components/container'
import Intro from '../../../components/intro'
import Layout from '../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../lib/constants'
import { getDevotionalContent, getDevotionals } from '../../../lib/api'
import { Disclosure } from '@headlessui/react'
import { useLang } from '../../../lang/langContext'
import { useTheme } from '../../../theme/themeContext'

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  const router = useRouter()
  const book = router.query.book
  const date = new Date();
  const month = date.getMonth()
  const day = date.getDate()

  const { data: dataDevotionals, loading: loadingDevotionals, error: errorDevotionals } = getDevotionals()
  const { data: dataContent, loading: loadingContent, error: errorContent } = getDevotionalContent(book, month, day)

  if (errorDevotionals) return <div>Failed to load</div>
  if (loadingDevotionals) return

  if (dataDevotionals && dataContent) {
    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="Devotionals" />

            <Disclosure>
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">{lang.Devotionals}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataDevotionals.map((text) => (
                    <Link href={"/devotional/" + text}>
                      <button className={`${theme.clickableButton}`}>{text}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure defaultOpen>
              <Disclosure.Button className={`${theme.chapterDisclosure}`}>
                <div className="text-2xl">{book}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
              </Disclosure.Panel>
            </Disclosure>

            <span className={`${theme.devotionalTextContainer}`} dangerouslySetInnerHTML={{ __html: dataContent }} />

          </Container>
        </Layout>
      </>
    )
  }
}
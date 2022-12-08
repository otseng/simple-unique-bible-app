import Container from '../../../components/container'
import Intro from '../../../components/intro'
import Layout from '../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../lib/constants'
import { chapterDisclosure, clickableButton, homeDisclosure } from '../../../lib/styles'
import { getDevotionalContent, getDevotionals } from '../../../lib/api'
import { Disclosure } from '@headlessui/react'
import { useLang } from '../../../lang/langContext'

export default function Index() {

  const {lang, setLang} = useLang()

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
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">{lang.Devotionals}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataDevotionals.map((text) => (
                    <Link href={"/devotional/" + text}>
                      <button className={`${clickableButton}`}>{text}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure defaultOpen>
              <Disclosure.Button className={`${chapterDisclosure}`}>
                <div className="text-2xl">{book}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <span className="text-container" dangerouslySetInnerHTML={{ __html: dataContent }} />
              </Disclosure.Panel>
            </Disclosure>

          </Container>
        </Layout>
      </>
    )
  }
}
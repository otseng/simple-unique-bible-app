import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../lib/constants'
import { preloadData } from '../../lib/util'
import { clickableButton, homeDisclosure, nonclickableButton } from '../../lib/styles'
import { getCommentaries } from '../../lib/api'
import { Disclosure } from '@headlessui/react'
import { useLang } from '../../lang/langContext'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const {lang, setLang} = useLang()
  const router = useRouter()
  const text = router.query.text

  const { data: dataCommentaries, loading: loadingCommentaries, error: errorCommentaries } = getCommentaries()

  if (errorCommentaries) return <div>Failed to load</div>
  if (loadingCommentaries) return <div>Loading...</div>

  if (dataCommentaries) {
    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="Commentaries" />

            <Disclosure defaultOpen>
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

          </Container>
        </Layout>
      </>
    )
  }
}
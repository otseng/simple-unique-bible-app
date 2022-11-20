import Container from '../../../components/container'
import Intro from '../../../components/intro'
import Layout from '../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../lib/constants'
import { preloadData } from '../../../lib/util'
import { clickableButton, homeDisclosure, nonclickableButton } from '../../../lib/styles'
import { getCommentaries } from '../../../lib/api'
import { Disclosure } from '@headlessui/react'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const title = router.query.title

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
                <div className="text-2xl">Commentaries</div>
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

            <Disclosure defaultOpen>
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

          </Container>
        </Layout>
      </>
    )
  }
}
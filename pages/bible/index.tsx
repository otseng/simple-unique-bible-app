import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../lib/constants'
import { preloadData } from '../../lib/util'
import { clickableButton, homeDisclosure, nonclickableButton } from '../../lib/styles'
import { getBibles } from '../../lib/api'
import { Disclosure } from '@headlessui/react'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const text = router.query.text

  const { data, loading, error } = getBibles()

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
            <Intro currentPage="Bibles" />

            <Disclosure defaultOpen>
            <Disclosure.Button className={`${homeDisclosure}`}>
              <div className="text-2xl">Bibles</div>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
              <div>
                {data.map((text) => (
                  <Link href={"/bible/" + text}>
                    <button className={`${clickableButton}`}>{text}</button>
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
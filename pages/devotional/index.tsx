import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../lib/constants'
import { clickableButton, homeDisclosure } from '../../lib/styles'
import { getDevotionals } from '../../lib/api'
import { Disclosure } from '@headlessui/react'

export default function Index() {

  const router = useRouter()

  const { data, loading, error } = getDevotionals()

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (data) {
    console.log(data)
    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="Devotionals" />

            <Disclosure defaultOpen>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">Devotionals</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {data.map((text) => (
                    <Link href={"/devotional/" + text}>
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
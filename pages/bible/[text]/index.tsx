import Container from '../../../components/container'
import Intro from '../../../components/intro'
import Layout from '../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../lib/constants'
import { preloadData } from '../../../lib/util'
import { clickableButton, homeDisclosure, nonclickableButton } from '../../../lib/styles'
import { getBibles, getBibleTextBooks } from '../../../lib/api'
import { Disclosure } from '@headlessui/react'
import { useLang } from '../../../lang/langContext'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const {lang, setLang} = useLang()

  const router = useRouter()
  const text = router.query.text

  const { data: dataBibles, loading: loadingBibles, error: errorBibles } = getBibles()
  const { data, loading, error } = getBibleTextBooks(text)

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (data && dataBibles) {

    const bookNames = data.map((number) => globalThis.bibleNumberToName[number])

    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="Bibles" />

            <Disclosure>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">{lang.Bibles}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataBibles.map((text) => (
                    <Link href={"/bible/" + text}>
                      <button className={`${clickableButton}`}>{text}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure defaultOpen>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">{text}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {bookNames.map((book) => (
                    <Link href={"/bible/" + text + "/" + book + "/1"}>
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
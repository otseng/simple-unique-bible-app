import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../lib/constants'
import { preloadData } from '../../lib/util'
import { getBibles } from '../../lib/api'
import { Disclosure } from '@headlessui/react'
import { useLang } from '../../lang/langContext'
import { langs } from '../../lang/languages'
import { useTheme } from '../../theme/themeContext'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  const router = useRouter()
  const fullText = router.query.text as string
  let text = fullText

  if (fullText && fullText.indexOf("-") > -1) {
    const texts = text.split("-")
    text = texts[0]
  }

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
            <Disclosure.Button className={`${theme.homeDisclosure}`}>
              <div className="text-2xl">{lang.Bibles}</div>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
              <div>
                {data.map((text) => (
                  <Link href={"/bible/" + text}>
                    <button className={`${theme.clickableButton}`}>{text}</button>
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
import Container from '../../../components/container'
import Intro from '../../../components/intro'
import Layout from '../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { APP_NAME } from '../../../lib/constants'
import { _getLexicon } from '../../../lib/api'
import { Disclosure } from '@headlessui/react'
import { useLang } from '../../../lang/langContext'
import { useTheme } from '../../../theme/themeContext'
import { useEffect, useState } from 'react'
import NoSsr from '../../../components/NoSsr'

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  const router = useRouter()
  const strongs = router.query.strongs as string

  const [lexiconData, setLexiconData] = useState("");

  useEffect(() => {
    if(router.isReady) {
      _getLexicon('TRLIT', strongs).then((resp) => {
        const data = resp[0].replaceAll('<a href', '<a target="new" href')
        setLexiconData(data)
      })
    }
  }, [router.isReady]);

  return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro currentPage="Lexicon" />
          
          <NoSsr/>
          
          <Disclosure>
            <Disclosure.Button className={`${theme.homeDisclosure}`}>
              <div className="text-2xl">{`Lexicon - ${strongs}`}</div>
            </Disclosure.Button>
          </Disclosure>
          
          {lexiconData && <>
            <div className="ml-4">
              <span dangerouslySetInnerHTML={{ __html: lexiconData }}/>
            </div>
          </>}
          
        </Container>
      </Layout>
    </>
  )
}


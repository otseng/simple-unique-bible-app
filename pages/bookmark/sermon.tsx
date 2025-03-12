
import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { APP_NAME } from '../../lib/constants'
import { addSermon, preloadData } from '../../lib/util'
import { useLang } from '../../lang/langContext'
import { useTheme } from '../../theme/themeContext'
import { useEffect } from 'react'

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()
  
  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()

  useEffect(() => {
    if(router.isReady) {
      const bm = router.query.bm
      if (typeof bm === 'undefined') {
      } else if (typeof bm === 'string') {
        addSermon(bm)
      } else {
        for (const b in bm) {
            addSermon(b)
        }
      }
      router.push('/bookmark')
    }
  }, [router.isReady]);

  return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro currentPage="Copying sermon bookmarks" />
        </Container>
      </Layout>
    </>
  )
}

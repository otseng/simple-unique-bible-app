import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../lib/constants'
import { preloadData } from '../../lib/util'
import { clickableButton, nonclickableButton } from '../../lib/styles'
import { getBibles } from '../../lib/api'

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
            <h1 className="text-l"><button className={`${nonclickableButton}`}>Bibles</button></h1>
            <p>&nbsp;</p>
            {data.map((text) => (
              <Link href={"/bible/" + text}>
                <button className={`${clickableButton}`}>{text}</button>
              </Link>
            ))}
          </Container>
        </Layout>
      </>
    )
  }
}
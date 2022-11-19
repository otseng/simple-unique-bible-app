import Container from '../../../components/container'
import Intro from '../../../components/intro'
import Layout from '../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../lib/constants'
import { preloadData } from '../../../lib/util'
import { clickableButton, nonclickableButton } from '../../../lib/styles'
import { getBibleTextBooks } from '../../../lib/api'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const text = router.query.text

  const { data, loading, error } = getBibleTextBooks(text)

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (data) {

    const bookNames = data.map((number) => globalThis.bibleNumberToName[number])

    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="true" />
            <h1 className="text-l"><button className={`${nonclickableButton}`}>{text}</button></h1>
            <p>&nbsp;</p>
            {bookNames.map((book) => (
              <Link href={"/bible/" + text + "/" + book + "/1"}>
                <button className={`${clickableButton}`}>{book}</button>
              </Link>
            ))}
          </Container>
        </Layout>
      </>
    )
  }
}
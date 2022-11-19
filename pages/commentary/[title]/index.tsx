import Container from '../../../components/container'
import Intro from '../../../components/intro'
import Layout from '../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../lib/constants'
import { preloadData } from '../../../lib/util'
import { clickableButton, nonclickableButton } from '../../../lib/styles'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const title = router.query.title

  return (
  <>
      <Layout>
      <Head>
          <title>{APP_NAME}</title>
      </Head>
      <Container>
          <Intro currentPage="true" />
          <h1 className="text-xl"><button className={`${nonclickableButton}`}>{title}</button></h1>
          <p>&nbsp;</p>
          <ul>
          {globalThis.bookNames.map((book) => (
            <Link href={"/commentary/" + title + "/" + book}>
              <button className={`${clickableButton}`}>{book}</button>
            </Link>
          ))}
        </ul>

      </Container>
      </Layout>
  </>
  )
}
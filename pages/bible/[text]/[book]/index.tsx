import Container from '../../../../components/container'
import Intro from '../../../../components/intro'
import Layout from '../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../lib/constants'
import { preloadData } from '../../../../lib/util'

export default function Index() {

  preloadData()

  const router = useRouter()
  const text = router.query.text
  const book = router.query.book

  return (
  <>
      <Layout>
      <Head>
          <title>{APP_NAME}</title>
      </Head>
      <Container>
          <Intro />
          <Link href={"/bible/" + text}><h1>{text}</h1></Link>
          <h2>{book}</h2>
      </Container>
      </Layout>
  </>
  )
}
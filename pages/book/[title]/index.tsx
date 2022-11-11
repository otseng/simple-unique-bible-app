import Container from '../../../components/container'
import Intro from '../../../components/intro'
import Layout from '../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../lib/constants'
import { getBookChapters } from '../../../lib/api'

export default function Index() {

  const router = useRouter()
  const title = router.query.title

  const { data, loading, error } = getBookChapters(title)

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
            <Intro />
            <div className="text-xl"><Link href={"/"}>{title}</Link></div>
            <p>&nbsp;</p>
            {data.map((chapter) => (
              <p><Link href={"/book/" + title + '/' + chapter}>{chapter}</Link></p>
            ))}
          </Container>
        </Layout>
      </>
    )
  }
}
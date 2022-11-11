import Container from '../../../../components/container'
import Intro from '../../../../components/intro'
import Layout from '../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../lib/constants'
import { getBookChapters, getBookChapterContent } from '../../../../lib/api'

export default function Index() {

  const router = useRouter()
  const title = router.query.title
  const chapter = router.query.chapter as string

  console.log(title)

  const { data, loading, error } = getBookChapterContent(title, chapter)

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (data) {

    const html = data.replace(/<ref.*\/ref>/, '')

    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro />
            <div className="text-xl"><Link href={"/"}>{title}</Link></div>
            <div className="text-l"><Link href={"/book/" + title}>{chapter}</Link></div>
            <p>&nbsp;</p>
            <div className="text-container" dangerouslySetInnerHTML={{ __html: html }} />
          </Container>
        </Layout>
      </>
    )
  }
}
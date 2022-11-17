import Container from '../../../../components/container'
import Intro from '../../../../components/intro'
import Layout from '../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../lib/constants'
import { getBookChapters, getBookChapterContent } from '../../../../lib/api'
import { scrollToTop } from '../../../../lib/util'
import { useEffect, useState } from 'react'
import { clickableButton } from '../../../../lib/styles'

export default function Index() {

  const router = useRouter()
  const title = router.query.title as string
  const chapter = router.query.chapter as string

  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  useEffect(() => {
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
          setShowScrollToTopButton(true);
        } else {
          setShowScrollToTopButton(false);
        }
      });
    }, []);

  const { data: dataChapters, loading: loadingChapters, error: errorChapters } = getBookChapters(title)

  const { data, loading, error } = getBookChapterContent(title, chapter)

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (data && dataChapters) {

    const navigation = getNavigation(dataChapters, chapter)

    const html = data.replace(/<ref.*\/ref>/, '')

    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro />
            <div className="text-2xl"><Link href={"/book/" + title}>{title.replaceAll('_', ' ')}</Link></div>
            <br/>
            <div className="text-xl font-bold">{chapter}</div>
            {navigation.previous && 
            <Link href={"/book/" + title + '/' + navigation.previous}>
                <button className={`${clickableButton}`}>{navigation.previous}</button>
            </Link>}
            {navigation.next && 
            <Link href={"/book/" + title + '/' + navigation.next}>
                <button className={`${clickableButton}`}>{navigation.next}</button>
            </Link>}
            <p>&nbsp;</p>
            <div className="text-container" dangerouslySetInnerHTML={{ __html: html }} />

            {showScrollToTopButton && (
            <button onClick={scrollToTop} className="back-to-top">
            &#8679;
            </button>
            )}
          </Container>
        </Layout>
      </>
    )
  }
}

function getNavigation(dataChapters, chapter) {
  let previous = ''
  let next = ''
  console.log(chapter)
  for (let i=0; i < dataChapters.length; i++) {
    if (dataChapters[i] == chapter) {
      console.log(dataChapters[i])
      if (i > 0) {
        previous = dataChapters[i-1]
      }
      if (i < dataChapters.length) {
        next = dataChapters[i+1]
      }
    }  
  }
  return {previous: previous, next: next}
}
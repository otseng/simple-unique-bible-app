import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../../lib/constants'
import { preloadData, scrollToTop } from '../../../../../lib/util'
import { getCommentaryContent } from '../../../../../lib/api'
import { Spinner } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { clickableButton } from '../../../../../lib/styles'

export default function Index() {

    if (!globalThis.bibleBooks) preloadData()

    const router = useRouter()
    const title = router.query.title
    const book = router.query.book as string
    const bookNum = globalThis.bookNameHash[book]
    const chapter = router.query.chapter as string
    const showPrevious = parseInt(chapter) > 1

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
      
    const { data, loading, error } = getCommentaryContent(title, bookNum, chapter)

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
            <h1 className="text-xl">Commentary / <Link href={"/commentary/" + title}>{title}</Link> / <Link href={"/commentary/" + title + '/' + book}>{book}</Link> {chapter}</h1>
                { showPrevious && (
                <Link href={"/commentary/" + title + '/' + book + '/' + (parseInt(chapter) - 1)}>
                <button className={`${clickableButton}`}>Previous</button>
                </Link>) }
                <Link href={"/commentary/" + title + '/' + book + '/' + (parseInt(chapter) + 1)}>
                <button className={`${clickableButton}`}>Next</button>
                </Link>
            <p>&nbsp;</p>
            {
                data.map((data) => (
                    <p><span className="title-container" dangerouslySetInnerHTML={{ __html: data }} /></p>
                ))
            }

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


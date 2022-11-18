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
import { clickableButton, nonclickableButton } from '../../../../../lib/styles'

export default function Index() {

    if (!globalThis.bibleBooks) preloadData()

    const router = useRouter()
    const title = router.query.title
    const book = router.query.book as string
    const bookNum = globalThis.bibleNameToNumber[book]
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
                        <Intro showHome="true" />
                        <h1 className="text-xl">
                            <Link href={"/commentary/" + title}><button className={`${clickableButton}`}>{title}</button></Link>
                            <Link href={"/commentary/" + title + '/' + book}><button className={`${clickableButton}`}>{book}</button></Link>
                            <button className={`${nonclickableButton}`}>{chapter}</button></h1>
                        <p>&nbsp;</p>
                        {
                            data.map((data) => (
                                <p><span className="title-container" dangerouslySetInnerHTML={{ __html: data }} /></p>
                            ))
                        }
                        {showPrevious && (
                            <Link href={"/commentary/" + title + '/' + book + '/' + (parseInt(chapter) - 1)}>
                                <button className={`${clickableButton}`}>Previous</button>
                            </Link>)}
                        <Link href={"/commentary/" + title + '/' + book + '/' + (parseInt(chapter) + 1)}>
                            <button className={`${clickableButton}`}>Next</button>
                        </Link>

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


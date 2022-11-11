import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../../lib/constants'
import { preloadData } from '../../../../../lib/util'
import { getBibleChapter } from '../../../../../lib/api'
import { Spinner } from 'react-bootstrap'

export default function Index() {

    if (!globalThis.bibleBooks) preloadData()

    const router = useRouter()
    const text = router.query.text
    const book = router.query.book as string
    const bookNum = globalThis.bookNameHash[book]
    const chapter = router.query.chapter as string

    const { data, loading, error } = getBibleChapter(text, bookNum, chapter)

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
            <h1><Link href={"/bible/" + text}>{text}</Link> / <Link href={"/bible/" + text + '/' + book}>{book}</Link> {chapter}</h1>
            <Link href={"/bible/" + text + '/' + book + '/' + (parseInt(chapter) - 1)}>Previous</Link> / <Link href={"/bible/" + text + '/' + book + '/' + (parseInt(chapter) + 1)}>Next</Link>
            <p>&nbsp;</p>
            {
                data.map((verse) => (
                    <p>{verse.c}:{verse.v} - <span className="text-container" dangerouslySetInnerHTML={{ __html: verse.t }} /></p>
                ))
            }
        </Container>
        </Layout>
    </>
    )
    }
}
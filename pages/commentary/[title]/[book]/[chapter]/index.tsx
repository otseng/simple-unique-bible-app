import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../../lib/constants'
import { preloadData } from '../../../../../lib/util'
import { getCommentaryContent } from '../../../../../lib/api'
import { Spinner } from 'react-bootstrap'

export default function Index() {

    if (!globalThis.bibleBooks) preloadData()

    const router = useRouter()
    const title = router.query.title
    const book = router.query.book as string
    const bookNum = globalThis.bookNameHash[book]
    const chapter = router.query.chapter as string

    const { data, loading, error } = getCommentaryContent(title, bookNum, chapter)

    if (error) return <div>Failed to load</div>
    if (loading) return <div>Loading</div>

    if (data) {
        return (
    <>
        <Layout>
        <Head>
            <title>{APP_NAME}</title>
        </Head>
        <Container>
            <Intro />
            <h1><Link href={"/commentary/" + title}>{title}</Link> / <Link href={"/commentary/" + title + '/' + book}>{book}</Link> {chapter}</h1>
            <Link href={"/commentary/" + title + '/' + book + '/' + (parseInt(chapter) - 1)}>Previous</Link> / <Link href={"/commentary/" + title + '/' + book + '/' + (parseInt(chapter) + 1)}>Next</Link>
            <p>&nbsp;</p>
            {
                data.map((data) => (
                    <p><span className="title-container" dangerouslySetInnerHTML={{ __html: data }} /></p>
                ))
            }
        </Container>
        </Layout>
    </>
    )
    }
}
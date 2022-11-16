import Container from '../../../../components/container'
import Intro from '../../../../components/intro'
import Layout from '../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../lib/constants'
import { preloadData, range } from '../../../../lib/util'
import { bibleChapters } from '../../../../data/bibleChapters'
import { clickableButton } from '../../../../lib/styles'

export default function Index() {

    if (!globalThis.bibleBooks) preloadData()

    const router = useRouter()
    const title = router.query.title
    const book = router.query.book as string
    const bookNum = globalThis.bookNameHash[book]
    const chapters = range(bibleChapters[bookNum], 1)

    return (
    <>
        <Layout>
        <Head>
            <title>{APP_NAME}</title>
        </Head>
        <Container>
            <Intro />
            <h1 className="text-xl">Commentary / <Link href={"/commentary/" + title}>{title}</Link> / {book}</h1>
            <p>&nbsp;</p>
            {chapters.map((chapter) => (
              <Link href={"/commentary/" + title + '/' + book + '/' + chapter}>
                <button className={`${clickableButton}`}>{chapter}</button>
              </Link>
            ))}
        </Container>
        </Layout>
    </>
    )
}

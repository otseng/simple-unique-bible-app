import Container from '../../../../components/container'
import Intro from '../../../../components/intro'
import Layout from '../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../lib/constants'
import { preloadData, range } from '../../../../lib/util'
import { bibleChapters } from '../../../../data/bibleChapters'
import { clickableButton, nonclickableButton } from '../../../../lib/styles'

export default function Index() {

    if (!globalThis.bibleBooks) preloadData()

    const router = useRouter()
    const text = router.query.text
    const book = router.query.book as string
    const bookNum = globalThis.bibleNameToNumber[book]
    const chapters = range(bibleChapters[bookNum], 1)

    return (
        <>
            <Layout>
                <Head>
                    <title>{APP_NAME}</title>
                </Head>
                <Container>
                    <Intro showHome="true" />
                    <h1 className="text-l font-bold">
                        <Link href={"/bible/" + text}><button className={`${clickableButton}`}>{text}</button></Link>
                        <button className={`${nonclickableButton}`}>{book}</button></h1>
                    <p>&nbsp;</p>
                    {chapters.map((chapter) => (
                        <Link href={"/bible/" + text + "/" + book + "/" + chapter}>
                            <button className={`${clickableButton}`}>{chapter}</button>
                        </Link>
                    ))}
                </Container>
            </Layout>
        </>
    )
}


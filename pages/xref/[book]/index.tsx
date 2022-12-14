import Container from '../../../components/container'
import Intro from '../../../components/intro'
import Layout from '../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../lib/constants'
import { getBibleNumberFromName, preloadData, range } from '../../../lib/util'
import { bibleChapters } from '../../../data/bibleChapters'
import { getBibleTextBooks } from '../../../lib/api'
import { Disclosure } from '@headlessui/react'
import { useLang } from '../../../lang/langContext'
import { useTheme } from '../../../theme/themeContext'

export default function Index() {

    const {lang, setLang} = useLang()
    const {theme, setTheme} = useTheme()

    if (!globalThis.bibleBooks) preloadData()

    const router = useRouter()
    const text = router.query.text
    const book = router.query.book as string
    const bookNum = getBibleNumberFromName(book)
    const chapters = range(bibleChapters[bookNum], 1)

    const { data: dataBooks, loading, error } = getBibleTextBooks(text)

    if (dataBooks) {

        const bookNames = dataBooks.map((number) => globalThis.bibleNumberToName[number])

        return (
            <>
                <Layout>
                    <Head>
                        <title>{APP_NAME}</title>
                    </Head>
                    <Container>
                        <Intro currentPage="Cross References" />

                        <Disclosure>
                            <Disclosure.Button className={`${theme.homeDisclosure}`}>
                                <div className="text-2xl">Cross Reference</div>
                            </Disclosure.Button>
                            <Disclosure.Panel className="text-gray-500">
                                <div>
                                    {bookNames.map((bookName) => (
                                        <Link href={"/xref/" + bookName}>
                                            <button className={`${theme.clickableButton}`}>{bookName}</button>
                                        </Link>
                                    ))}
                                </div>
                            </Disclosure.Panel>
                        </Disclosure>

                        <Disclosure defaultOpen>
                            <Disclosure.Button className={`${theme.homeDisclosure}`}>
                                <div className="text-2xl">{book}</div>
                            </Disclosure.Button>
                            <Disclosure.Panel className="text-gray-500">
                                <div>
                                    {chapters.map((chapter) => (
                                        <Link href={"/xref/" + book + "/" + chapter}>
                                            <button className={`${theme.clickableButton}`}>{chapter}</button>
                                        </Link>
                                    ))}
                                </div>
                            </Disclosure.Panel>
                        </Disclosure>

                    </Container>
                </Layout>
            </>
        )
    }
}


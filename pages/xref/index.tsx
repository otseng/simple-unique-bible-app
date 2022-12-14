import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import Link from 'next/link'
import { APP_NAME } from '../../lib/constants'
import { preloadData } from '../../lib/util'
import { Disclosure } from '@headlessui/react'
import { useLang } from '../../lang/langContext'
import { useTheme } from '../../theme/themeContext'

export default function Index() {

    const {lang, setLang} = useLang()
    const {theme, setTheme} = useTheme()

    if (!globalThis.bibleBooks) preloadData()

    return (
        <>
            <Layout>
                <Head>
                    <title>{APP_NAME}</title>
                </Head>
                <Container>
                    <Intro currentPage="Cross Reference" />

                    <Disclosure defaultOpen>
                        <Disclosure.Button className={`${theme.homeDisclosure}`}>
                            <div className="text-2xl">Cross Reference</div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="text-gray-500">
                            <div>
                                {globalThis.bookNames.map((book) => (
                                    <Link href={"/xref/" + book}>
                                        <button className={`${theme.clickableButton}`}>{book}</button>
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
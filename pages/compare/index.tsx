import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import Link from 'next/link'
import { APP_NAME } from '../../lib/constants'
import { preloadData } from '../../lib/util'
import { clickableButton, homeDisclosure } from '../../lib/styles'
import { Disclosure } from '@headlessui/react'

export default function Index() {

    if (!globalThis.bibleBooks) preloadData()

    return (
        <>
            <Layout>
                <Head>
                    <title>{APP_NAME}</title>
                </Head>
                <Container>
                    <Intro currentPage="true" />

                    <Disclosure defaultOpen>
                        <Disclosure.Button className={`${homeDisclosure}`}>
                            <div className="text-2xl">Compare</div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="text-gray-500">
                            <div>
                                {globalThis.bookNames.map((book) => (
                                    <Link href={"/compare/" + book}>
                                        <button className={`${clickableButton}`}>{book}</button>
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
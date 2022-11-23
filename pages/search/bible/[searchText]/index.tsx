import Container from '../../../../components/container'
import Intro from '../../../../components/intro'
import Layout from '../../../../components/layout'
import Head from 'next/head'
import { APP_NAME, DOMAIN } from '../../../../lib/constants';
import { clickableButton, homeDisclosure, textStrongs } from '../../../../lib/styles';
import { Disclosure } from '@headlessui/react';
import { useRouter } from 'next/router';
import { searchBible } from '../../../../lib/api';
import Link from 'next/link';
import { getBibleTextDir, preloadData } from '../../../../lib/util';

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const searchText = router.query.searchText

  const text: string = 'KJV'
  const { data: dataVerses, loading, error } = searchBible(searchText, text)

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (dataVerses) {
    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="Search" />

            <Disclosure defaultOpen>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">Bible search results</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">

                <div className="m-10">

                <Link href={"/search"}>
                    <button className={`${clickableButton}`}>Back to search</button>
                </Link>

                <p className="font-bold">Search "{searchText}" - {dataVerses.length} verses found</p>

                {dataVerses.map((data) => {
                const bookNum = data[0]
                const book = globalThis.bibleNumberToName[bookNum]
                const chapter = data[1]
                const verse = data[2]
                const verseStr = data[3]
                const dir = getBibleTextDir(text, bookNum)
                if (verseStr) {
                  const link = <Link href={"/bible/" + data[0] + "/" + book + "/" + chapter + "#v" + chapter + "_" + verse}>{book} {chapter}:{verse}</Link>
                  if (text.endsWith('+') || text.endsWith('x')) {
                    const parsed = verseStr.split(' ').map((word) => (
                      word.match(/[GH][0-9]{1,4}/) ?
                        <sup><a className={`${textStrongs}`}>{word} </a></sup>
                        : <span dangerouslySetInnerHTML={{ __html: word + " " }} />
                    ))
                    return (<p className="mt-2" dir={dir}>{link} - {parsed}</p>)
                  } else {
                    return (<p className="mt-2" dir={dir}>{link} - <span className="text-container" dangerouslySetInnerHTML={{ __html: verseStr }} /></p>)
                  }
                }
              })
              }
                </div>

              </Disclosure.Panel>
            </Disclosure>

          </Container>
        </Layout>
      </>
    )
  }
}

import Container from '../../../../components/container'
import Intro from '../../../../components/intro'
import Layout from '../../../../components/layout'
import Head from 'next/head'
import { APP_NAME } from '../../../../lib/constants';
import { Disclosure } from '@headlessui/react';
import { useRouter } from 'next/router';
import { searchBible } from '../../../../lib/api';
import Link from 'next/link';
import { getBibleTextDir, preloadData } from '../../../../lib/util';
import { Spinner } from 'react-bootstrap';
import { useLang } from '../../../../lang/langContext';
import { useTheme } from '../../../../theme/themeContext';

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const searchText = router.query.searchText as string
  let text = router.query.text as string
  if (!text) text = "KJV"
  const { data: dataVerses, loading, error } = searchBible(searchText, text)

  if (error) return <div>Failed to load</div>
  if (loading) return <div>Loading...</div>

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
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">Bible search results</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">

                <div className="m-10">

                  <Link href={"/search?text=" + `${text}`}>
                    <button className={`${theme.clickableButton}`}>Back to search</button>
                  </Link>

                  <p className="font-bold">Search "{searchText}" in {text} - {dataVerses.length} verses found</p>

                  {dataVerses.map((data) => {
                    const bookNum = data[0]
                    const book = globalThis.bibleNumberToName[bookNum]
                    const chapter = data[1]
                    const verse = data[2]
                    let verseStr = data[3]
                    const dir = getBibleTextDir(text, bookNum)
                    if (verseStr) {
                      const link = <Link href={"/bible/" + text + "/" + book + "/" + chapter + "#v" + chapter + "_" + verse}>{book} {chapter}:{verse}</Link>
                      verseStr = highlight(verseStr, searchText)
                      return (<p className="mt-2 color-black" dir={dir}>{link} - <span className="text-container" dangerouslySetInnerHTML={{ __html: verseStr }} /></p>)
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
function highlight(html: string, searchText: string): any {
  if (searchText.includes(" ")) {
    searchText.split(' ').map((word) => {
      html = html.replace(new RegExp("(" + word + ")", "ig"), "<span style='background-color: rgb(254 240 138);'>$1</span>")
    })
  } else {
    searchText = searchText.replaceAll('"', '')
    html = html.replace(new RegExp("(" + searchText + ")", "ig"), "<span style='background-color: rgb(254 240 138);'>$1</span>")
  }
  return html

}


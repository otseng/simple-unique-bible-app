import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { APP_NAME } from '../../../../../lib/constants';
import { Disclosure } from '@headlessui/react';
import { useRouter } from 'next/router';
import { lexiconReverse } from '../../../../../lib/api';
import Link from 'next/link';
import { getBibleTextDir, preloadData } from '../../../../../lib/util';
import { Spinner } from 'react-bootstrap';
import { useLang } from '../../../../../lang/langContext';
import { useTheme } from '../../../../../theme/themeContext';

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const searchText = router.query.searchText as string
  const lexicon = router.query.lexicon as string
  const { data: dataLexicon, loading, error } = lexiconReverse(searchText, lexicon)

  if (error) return <div>Failed to load</div>
  if (loading) return <div>Loading...</div>

  if (dataLexicon) {
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
                <div className="text-2xl">{lang.Search_results}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">

                <div className="m-10">

                  <Link href={`/search?q=${searchText}`}>
                    <button className={`${theme.clickableButton}`}>{lang.Back_to_search}</button>
                  </Link>

                  <p className={`${theme.bibleTextContainer}` + " font-bold text-xl"}>Reverse Lexicon Search: "{searchText}"</p>

                  {dataLexicon.map((data) => {
                    const strongs = data[0]
                    const entry = data[1]
                    const exp = '' + searchText + '[ .,()]'
                    const regexp = new RegExp(exp)
                    if (entry && regexp.test(entry)) {
                      const highlightedEntry = highlight(entry, searchText)
                      return (
                        <>
                        <p className={`${theme.bibleDivContainer}` + " mt-2"}>
                        <div className={`${theme.chapterDisclosure}`}>
                          {strongs}
                        </div>
                          <span className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: highlightedEntry }} />
                        </p>
                        <div className="mt-5 pl-20 pr-20"><hr/></div>
                        </>
                      )
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


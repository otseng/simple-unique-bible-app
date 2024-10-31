import Container from '../../../../components/container'
import Intro from '../../../../components/intro'
import Layout from '../../../../components/layout'
import Head from 'next/head'
import { APP_NAME } from '../../../../lib/constants';
import { Disclosure } from '@headlessui/react';
import { useRouter } from 'next/router';
import { searchBible, getBook2Number } from '../../../../lib/api';
import Link from 'next/link';
import { getBibleTextDir, highlight, preloadData } from '../../../../lib/util';
import { Spinner } from 'react-bootstrap';
import { useLang } from '../../../../lang/langContext';
import { useTheme } from '../../../../theme/themeContext';

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const searchText = router.query.searchText as string

  if (searchText == undefined || searchText == "") {
    router.push('/search/bible')
  }

  let fullText = router.query.text as string
  let text = fullText
  if (!fullText) text = "KJV"
  if (fullText && fullText.indexOf("-") > -1) {
    const texts = fullText.split("-")
    text = texts[0]
  }
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
                <div className="text-2xl">{lang.Search_results}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">

                <div className="m-10">

                  <Link href={`/search?text=${fullText}&q=${searchText}`}>
                    <button className={`${theme.clickableButton}`}>{lang.Back_to_search}</button>
                  </Link>

                  <p className={`${theme.bibleTextContainer}` + " font-bold text-xl"}>"{searchText}" ({text}) - {dataVerses.length} {lang.verses_found}</p>

                  {dataVerses.map((data) => {
                    const bookNum = data[0]
                    const book = globalThis.bibleNumberToName[bookNum]
                    const chapter = data[1]
                    const verse = data[2]
                    let verseStr = data[3]
                    const dir = getBibleTextDir(text, bookNum)
                    if (verseStr) {
                      const link = <Link className={`${theme.bibleReferenceContainer}`} href={"/bible/" + fullText + "/" + book + "/" + chapter + "#v" + chapter + "_" + verse}>{book} {chapter}:{verse}</Link>
                      verseStr = highlight(verseStr, searchText)
                      return (<p className={`${theme.bibleDivContainer}` + " mt-2"} dir={dir}>{link} - <span className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: verseStr }} /></p>)
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



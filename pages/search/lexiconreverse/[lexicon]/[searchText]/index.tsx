import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { APP_NAME } from '../../../../../lib/constants';
import { Disclosure } from '@headlessui/react';
import { useRouter } from 'next/router';
import { _getLexicon, lexiconReverse } from '../../../../../lib/api';
import Link from 'next/link';
import { getBibleTextDir, highlight, preloadData, processLexiconData } from '../../../../../lib/util';
import { Spinner } from 'react-bootstrap';
import { useLang } from '../../../../../lang/langContext';
import { useTheme } from '../../../../../theme/themeContext';
import { getTheme } from '../../../../../theme/themeUtil';
import { useState } from 'react';
import BasicModal from '../../../../../components/basic-modal';

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()
  const [scrolledRef, setScrolledRef] = useState(true)
  const [strongsModal, setStrongsModal] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')
  const [showModal, setShowModal] = useState(false)

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const searchText = router.query.searchText as string
  const lexicon = router.query.lexicon as string
  const { data: dataLexicon, loading, error } = lexiconReverse(searchText, lexicon)

  if (error) return <div>Failed to load</div>
  if (loading) return <div>Loading...</div>

  function showLexicon(strongs) {
    setScrolledRef(false)
    setStrongsModal(strongs)
    setModalTitle(strongs)
    try {
      _getLexicon('TRLIT', strongs).then((resp) => {
        const html = processLexiconData(resp[0])
        if (!html.includes("[Not found]")) {
          setModalContent(html)
          setShowModal(true)
        } else {
          _getLexicon('SECE', strongs).then((resp) => {
            if (resp[0] != "[Not found]") {
              const html = resp[0]?.replaceAll('<a href', '<a target="new" href')
              setModalContent(html)
              setShowModal(true)
            }
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  function searchStrongs() {
    let strongs = strongsModal
    let bible = 'KJVx'
    const url = `/search/concordance/${bible}/${strongs}?return=/bible/KJV-TRLITx/Matthew/1`

    router.push(url)
  }
  
  if (dataLexicon) {
    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            {showModal && <Intro currentPage="Search" visibility="invisible"/>}
            {!showModal && <Intro currentPage="Search"/>}

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
                          <a onClick={() => showLexicon(strongs)}>{strongs}</a>
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

            <BasicModal show={showModal} setter={setShowModal} title={modalTitle} searchStrongs={searchStrongs} 
            content={modalContent} strongsModal={strongsModal}
            showLexicon={showLexicon}></BasicModal>
            
          </Container>
        </Layout>
      </>
    )
  }
}



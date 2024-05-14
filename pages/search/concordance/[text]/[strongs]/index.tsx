import Container from '../../../../../components/container'
import Intro from '../../../../../components/intro'
import Layout from '../../../../../components/layout'
import Head from 'next/head'
import { APP_NAME } from '../../../../../lib/constants';
import { Disclosure } from '@headlessui/react';
import { useRouter } from 'next/router';
import { _getLexicon, concordanceSearch } from '../../../../../lib/api';
import Link from 'next/link';
import { getBibleTextDir, highlightStrongs, preloadData } from '../../../../../lib/util';
import { useLang } from '../../../../../lang/langContext';
import { useTheme } from '../../../../../theme/themeContext';
import { useState } from 'react';
import BasicModal from '../../../../../components/basic-modal';

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const strongs = router.query.strongs as string
  let text = router.query.text as string
  const returnLink = router.query.return as string

  const { data: dataVerses, loading, error } = concordanceSearch(strongs, text)

  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')

  function showLexicon() {
    
    setModalTitle('Lexicon - ' + strongs)
    _getLexicon('TRLIT', strongs).then((resp) => {
      const html = resp[0]?.replaceAll('<a href', '<a target="new" href')
      console.log(html)
      if (!html.includes("[Not found]")) {
        setModalContent(html)
        setShowModal(true)
      } else {
        _getLexicon('SECE', strongs).then((resp) => {
          const html = resp[0]?.replaceAll('<a href', '<a target="new" href')
          setModalContent(html)
          setShowModal(true)
        })
      }
    })
  }

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
            <Intro currentPage="Concordance" />

            <Disclosure defaultOpen>
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">{lang.Search_results}</div>
              </Disclosure.Button>
              
              <Disclosure.Panel className="text-gray-500">

                <div className="m-10">

                  <Link href={`/search`}>
                    <button className={`${theme.clickableButton}`}>{lang.Search}</button>
                  </Link>
                  {returnLink && 
                  <Link href={`/${returnLink}`}>
                    <button className={`${theme.clickableButton}`}>{lang.Back_to_Bible}</button>
                  </Link>
                  }
                  {returnLink && 
                    <button onClick={showLexicon} className={`${theme.clickableButton}`}>{strongs}</button>
                  }
                  <p className={`${theme.bibleTextContainer}` + " font-bold text-xl"}>"{strongs}" ({text}) - {dataVerses.length} {lang.verses_found}</p>

                  {dataVerses.map((data) => {
                    const bookNum = data[0]
                    const book = globalThis.bibleNumberToName[bookNum]
                    const chapter = data[1]
                    const verse = data[2]
                    let verseStr = data[3]
                    const dir = getBibleTextDir(text, bookNum)
                    if (verseStr) {
                      const link = <Link className={`${theme.bibleReferenceContainer}`} href={"/bible/" + text + "/" + book + "/" + chapter + "#v" + chapter + "_" + verse}>{book} {chapter}:{verse}</Link>
                      verseStr = highlightStrongs(verseStr, strongs + " ")
                      return (<p className={`${theme.bibleDivContainer}` + " mt-2"} dir={dir}>{link} - <span className={`${theme.bibleTextContainer}`} dangerouslySetInnerHTML={{ __html: verseStr }} /></p>)
                    }
                  })
                  }
                </div>

              </Disclosure.Panel>
            </Disclosure>

            <BasicModal show={showModal} setter={setShowModal} title={modalTitle} content={modalContent}></BasicModal>

          </Container>
        </Layout>
      </>
    )
  }
}



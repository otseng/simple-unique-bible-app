import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import Head from 'next/head'
import Link from 'next/link';
import { getBibles, getBooks, getCommentaries, getDevotionals } from '../lib/api'
import { APP_NAME } from '../lib/constants';
import { clickableButton, homeDisclosure } from '../lib/styles';
import { Disclosure } from '@headlessui/react';
import { useLang } from '../lang/langContext';
import { showDevotions } from '../lang/langUtil';
import { preloadData } from '../lib/util';

export default function Index() {

  const {lang, setLang} = useLang()

  if (!globalThis.bibleBooks || !globalThis.bookNames) preloadData()

  const { data: dataBible, loading: loadingBible, error: errorBible } = getBibles()
  const { data: dataBooks, loading: loadingBooks, error: errorBooks } = getBooks()
  const { data: dataCommentary, loading: loadingCommentary, error: errorCommentary } = getCommentaries()
  const { data: dataDevotionals, loading: loadingDevotionals, error: errorDevotionals } = getDevotionals()

  if (errorBible || errorBooks || errorCommentary || errorDevotionals) return <div>Failed to load</div>
  if (loadingBible || loadingBooks || loadingCommentary || loadingDevotionals) return
  if (dataBible && dataBooks && dataCommentary && dataDevotionals && globalThis.bookNames) return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro currentPage="Home" />

          <Disclosure defaultOpen>
            <Disclosure.Button className={`${homeDisclosure}`}>
              <div className="text-2xl">{lang.Bibles}</div>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
              <div>
                {dataBible.map((text) => (
                  <Link href={"/bible/" + text}>
                    <button className={`${clickableButton}`}>{text}</button>
                  </Link>
                ))}
              </div>
            </Disclosure.Panel>
          </Disclosure>

         {showDevotions() && 
          <Disclosure defaultOpen>
            <Disclosure.Button className={`${homeDisclosure}`}>
              <div className="text-2xl">{lang.Devotionals}</div>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
              <div>
                {dataDevotionals.map((text) => (
                  <Link href={"/devotional/" + text}>
                    <button className={`${clickableButton}`}>{text}</button>
                  </Link>
                ))}
              </div>
            </Disclosure.Panel>
          </Disclosure>}

          <Disclosure defaultOpen>
            <Disclosure.Button className={`${homeDisclosure}`}>
              <div className="text-2xl">{lang.Books}</div>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
              <div>
                {dataBooks.map((title) => (
                  <Link href={"/book/" + title}>
                    <button className={`${clickableButton}`}>
                      {title.replaceAll('_', ' ')}</button>
                  </Link>
                ))}
              </div>
            </Disclosure.Panel>
          </Disclosure>

          <Disclosure defaultOpen>
            <Disclosure.Button className={`${homeDisclosure}`}>
              <div className="text-2xl">{lang.Commentaries}</div>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
              <div>
                {dataCommentary.map((commentary) => (
                  <Link href={"/commentary/" + commentary}>
                    <button className={`${clickableButton}`}>
                      {commentary.replaceAll('_', ' ')}
                    </button>
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


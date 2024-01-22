import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import Head from 'next/head'
import { APP_NAME, DOMAIN } from '../lib/constants';
import QRCode from "react-qr-code";
import { Disclosure } from '@headlessui/react';
import { useLang } from '../lang/langContext';
import { useTheme } from '../theme/themeContext';

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro currentPage="About" />

          <Disclosure defaultOpen>
            <Disclosure.Button className={`${theme.homeDisclosure}`}>
              <div className="text-2xl">{lang.About}</div>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">

          <div className="m-10">

            <p className="text-xl">Simple web viewer for <a href="https://github.com/eliranwong/UniqueBible">Unique Bible App</a> written in <a href="https://reactjs.org/">React</a> / <a href="https://nextjs.org/">Next</a>.</p>

            <div className="text-center mt-10">
            <a href="https://github.com/otseng/simple-unique-bible-viewer/wiki/FAQ"><button className={`${theme.clickableButton}`}>FAQ</button></a>
            <a href="https://github.com/otseng/simple-unique-bible-viewer/issues"><button className={`${theme.clickableButton}`}>Suggest a feature</button></a>
            <a href="https://github.com/otseng/simple-unique-bible-viewer/discussions"><button className={`${theme.clickableButton}`}>Feedback / Questions</button></a>
            </div>

            <p className="text-xl font-bold mt-10 mb-10">App QR Code</p>
            <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "400" }}>
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={DOMAIN}
                viewBox={`0 0 256 256`}
              />
              <div className="mt-5 justify-center"><a href={`${DOMAIN}`} target="_new">{DOMAIN}</a></div>
            </div>

            <p className="text-xl font-bold mt-10 mb-3">UBA viewers</p>
            <ul>
              <li><a href="https://uniquebibleapp.net/index.html?cmd=.bible">
                <button className={`${theme.clickableButton}`}>UniqueBibleApp.net</button></a></li>
              <li><a href="https://bible.gospelchurch.uk">
                <button className={`${theme.clickableButton}`}>GospelChurch.uk</button></a></li>
              <li><a href="https://marvelbible.com">
                <button className={`${theme.clickableButton}`}>MarvelBible.com</button></a></li>
            </ul>

            <p className="text-xl font-bold mt-10 mb-3">Unique Bible App</p>
            <ul>
              <li><a href="https://github.com/eliranwong/UniqueBible">
                <button className={`${theme.clickableButton}`}>Github</button></a></li>
            </ul>

            <p className="text-xl font-bold mt-10 mb-3">Development</p>
            <ul>
              <li><a href="https://ecodia.com">
                <button className={`${theme.clickableButton}`}>Ecodia</button></a></li>
            </ul>

          </div>

          </Disclosure.Panel>
          </Disclosure>

        </Container>
      </Layout>
    </>
  )
}


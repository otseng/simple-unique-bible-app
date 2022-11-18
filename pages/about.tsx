import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import Head from 'next/head'
import Link from 'next/link';
import { getBibles, getBooks, getCommentaries } from '../lib/api'
import Spinner from 'react-bootstrap/Spinner';
import { APP_NAME } from '../lib/constants';
import { clickableButton, homeDisclosure, nonclickableButton } from '../lib/styles';
import { scrollToTop } from '../lib/util';
import { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';

export default function Index() {

  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowScrollToTopButton(true);
      } else {
        setShowScrollToTopButton(false);
      }
    });
  }, []);

return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro showHome="true"/>

          <div className="text-xl"><button className={`${nonclickableButton}`}>About</button></div>

          <div className="m-10">
            
            <p>Simple web viewer for <a target="new" href="https://github.com/eliranwong/UniqueBible">UniqueBibleApp</a> written in React/Next.</p>

            <p>&nbsp;</p>

            <p className="text-xl font-bold">More UBA viewers</p>
            <ul>
              <li><a target="new" href="https://transliteralbible.com/index.html?cmd=.bible">
                <button className={`${clickableButton}`}>TransliteralBible.com</button></a></li>
              <li><a target="new" href="https://bible.gospelchurch.uk/index.html?cmd=John%203:16">
              <button className={`${clickableButton}`}>GospelChurch.uk</button></a></li>
            </ul>
            
          </div>

          {showScrollToTopButton && (
            <button onClick={scrollToTop} className="back-to-top">
              &#8679;
            </button>
          )}
        </Container>
      </Layout>
    </>
  )
}


import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import Head from 'next/head'
import { APP_NAME } from '../lib/constants';
import { clickableButton, nonclickableButton } from '../lib/styles';
import { scrollToTop } from '../lib/util';
import { useEffect, useState } from 'react';
import BasicModal from '../components/basic-modal';

export default function Index() {

  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowScrollToTopButton(true);
      } else {
        setShowScrollToTopButton(false);
      }
    });
  }, []);

  function displayModal() {
    setShowModal(true)
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro currentPage="true" />

          <div className="text-xl"><button className={`${nonclickableButton}`}>Playground</button></div>

          <div className="m-10">

            <button className={`${clickableButton}`} onClick={displayModal}>Open Modal</button>

          </div>

          <BasicModal show={showModal} setter={setShowModal} title="Test Modal" content="This is my content"></BasicModal>

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


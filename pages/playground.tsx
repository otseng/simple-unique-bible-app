import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import Head from 'next/head'
import { APP_NAME } from '../lib/constants';
import { clickableButton, nonclickableButton } from '../lib/styles';
import { useState } from 'react';
import BasicModal from '../components/basic-modal';
import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css"

const BIBLE_VERSE_POPUP_MENU = "bible-verse-popup-menu"

export default function Index() {

  const [showModal, setShowModal] = useState(false);

  function displayModal() {
    setShowModal(true)
  }

  function handleItemClick({ id, event, props, data, triggerEvent }) {
    console.log(id, event, triggerEvent)
  }

  const { show } = useContextMenu({
    id: BIBLE_VERSE_POPUP_MENU
  })

  function displayMenu(e) {
    show({
      event: e,
    })
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro currentPage="Playground" />

          <div className="text-xl"><button className={`${nonclickableButton}`}>Playground</button></div>

          <div className="m-10">

            <button className={`${clickableButton}`} onClick={displayModal}>Open Modal</button>

            <BasicModal show={showModal} setter={setShowModal} title="Test Modal" content="This is my content"></BasicModal>


            <button className={`${clickableButton}`} onClick={displayMenu}>Context menu</button>

          </div>


          <Menu id={BIBLE_VERSE_POPUP_MENU}>
            <Item id="copy" onClick={handleItemClick}><span className="text-sm">Copy link</span></Item>
            <Item id="xref" onClick={handleItemClick}><span className="text-sm">Cross-references</span></Item>
            <Item id="compare" onClick={handleItemClick}><span className="text-sm">Quick compare</span></Item>
            <Separator />
            <Submenu className="text-sm" label="Commentary">
              <Item onClick={handleItemClick}><span className="text-sm">Commentary A</span></Item>
              <Item onClick={handleItemClick}><span className="text-sm">Commentary B</span></Item>
            </Submenu>
          </Menu>

        </Container>
      </Layout>
    </>
  )
}


import React from 'react';
import Container from './container'
import getConfig from 'next/config';
import { getLang, isDev, setLocalStorage } from '../lib/util';
import { useLang } from '../lang/langContext';
import { Item, Menu, Separator, useContextMenu } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css"
import router from 'next/router';


const Footer = () => {

  const { lang, setLang } = useLang()
  const { publicRuntimeConfig } = getConfig()
  const version = publicRuntimeConfig?.version
  const language = getLang()

  const LANGUAGE_POPUP_MENU = 'language-popup-menu'
  const { show } = useContextMenu({
    id: LANGUAGE_POPUP_MENU
  })

  function handleItemClick({ id, event, props, data, triggerEvent }) {
    setLocalStorage("lang", id)
    const url = window.location.protocol + '//' + window.location.host
    router.push(url)
  }

  function displayMenu(e) {
    show({
      event: e,
    })
  }

  return (
    <>
      <footer className="bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="flex justify-center items-center pt-5 pb-5 text-sm font-bold text-slate-400">
            {isDev() && <span>(Dev Mode)&nbsp;</span>}
            <a href="https://github.com/otseng/simple-unique-bible-viewer/blob/main/CHANGELOG.md" target="new">{lang.Version}: {version}</a>&nbsp;&bull;&nbsp;
            <span className="hover:cursor-pointer" onClick={displayMenu}>{lang.Language} ({language})</span>
            &nbsp;&bull;&nbsp;
            <a href="https://github.com/eliranwong/UniqueBible" target="new">Unique Bible App</a>
          </div>
        </Container>
      </footer>
      <Menu id={LANGUAGE_POPUP_MENU}>
        <Item id="en" onClick={handleItemClick}><span className="text-md">English</span></Item>
        <Item id="zh_HANT" onClick={handleItemClick}><span className="text-md">zh_HANT</span></Item>
        <Item id="zh_HANS" onClick={handleItemClick}><span className="text-md">zh_HANS</span></Item>
      </Menu>

    </>
  )
}

export default Footer

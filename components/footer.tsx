import React from 'react';
import Container from './container'
import getConfig from 'next/config';
import { getLang, isDev, isPowerMode, setLocalStorage } from '../lib/util';
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

  let modeInfo = ""
  if (isDev() || isPowerMode()) {
    if (isDev()) modeInfo += "Dev "
    if (isPowerMode()) modeInfo += "Power "
    modeInfo += "mode"
  }

  function handleItemClick({ id, event, props, data, triggerEvent }) {
    if (isDev()) {
      setLocalStorage("lang", id)
      const url = window.location.protocol + '//' + window.location.host
      router.push(url)
    } else {
      setLocalStorage("lang", '')
      if (id == "en") {
        router.push('https://simple.uniquebibleapp.com')
      } else if (id == "zh_HANT") {
        router.push('https://tc.uniquebibleapp.com')
      } else if (id == "zh_HANS") {
        router.push('https://sc.uniquebibleapp.com')
      }
    }
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
            <a href="https://github.com/otseng/simple-unique-bible-viewer/blob/main/CHANGELOG.md" target="new">{lang.Version}: {version}</a>
            {modeInfo && <span>&nbsp;({modeInfo})</span>}
            &nbsp;&bull;&nbsp;
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

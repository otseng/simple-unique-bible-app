import React from 'react';
import Container from './container'
import getConfig from 'next/config';
import { isDev, isPowerMode, setLocalStorage } from '../lib/util';
import { useLang } from '../lang/langContext';
import { Item, Menu, useContextMenu } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css"
import router from 'next/router';
import { getLang } from '../lang/langUtil';
import { useTheme } from '../theme/themeContext';
import { getTheme } from '../theme/themeUtil';

const Footer = () => {

  const { lang, setLang } = useLang()
  const { theme, setTheme } = useTheme()

  const { publicRuntimeConfig } = getConfig()
  const version = publicRuntimeConfig?.version

  const LANGUAGE_POPUP_MENU = 'language-popup-menu'
  const { show: showLanguageMenu } = useContextMenu({
    id: LANGUAGE_POPUP_MENU
  })
  const THEME_POPUP_MENU = 'theme-popup-menu'
  const { show: showThemeMenu } = useContextMenu({
    id: THEME_POPUP_MENU
  })

  let modeInfo = ""
  if (isDev() || isPowerMode()) {
    if (isDev()) modeInfo += "Dev"
    if (isPowerMode()) modeInfo += "x"
  }

  function handleLanguageItemClick({ id, event, props, data, triggerEvent }) {
    if (isDev()) {
      setLocalStorage("lang", id)
      gotoHome()
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

  function handleThemeItemClick({ id, event, props, data, triggerEvent }) {
    setLocalStorage("theme", id)
    setTheme(id)
    console.log("setting theme to " + id)
  }

  function displayLanguageMenu(e) {
    showLanguageMenu({
      event: e,
    })
  }

  function displayThemeMenu(e) {
    showThemeMenu({
      event: e,
    })
  }

  function disablePowerMode() {
    setLocalStorage("powerMode", false)
    gotoHome()
  }

  function gotoHome() {
    const url = window.location.protocol + '//' + window.location.host
    router.push(url)
  }

  return (
    <>
      <footer className={`${theme.footerStyle}`}>
        <Container>
          <div className="flex justify-center items-center pt-5 pb-5 text-sm font-bold text-slate-400">
            <a href="https://github.com/otseng/simple-unique-bible-viewer/blob/main/CHANGELOG.md" target="new">{lang.Version}: {version}</a>
            {modeInfo && <span onClick={disablePowerMode}>&nbsp;({modeInfo})</span>}
            &nbsp;&bull;&nbsp;
            <span className="hover:cursor-pointer" onClick={displayLanguageMenu}>{lang.Language} ({getLang()})</span>
            &nbsp;&bull;&nbsp;
            <span className="hover:cursor-pointer" onClick={displayThemeMenu}>{lang.Theme} ({getTheme()})</span>
          </div>
        </Container>
      </footer>
      <Menu id={LANGUAGE_POPUP_MENU}>
        <Item id="en" onClick={handleLanguageItemClick}><span className="text-md">English</span></Item>
        <Item id="zh_HANT" onClick={handleLanguageItemClick}><span className="text-md">zh_HANT</span></Item>
        <Item id="zh_HANS" onClick={handleLanguageItemClick}><span className="text-md">zh_HANS</span></Item>
      </Menu>
      <Menu id={THEME_POPUP_MENU}>
        <Item id="default" onClick={handleThemeItemClick}><span className="text-md">default</span></Item>
        <Item id="large" onClick={handleThemeItemClick}><span className="text-md">large</span></Item>
        <Item id="dark" onClick={handleThemeItemClick}><span className="text-md">dark</span></Item>
      </Menu>

    </>
  )
}

export default Footer

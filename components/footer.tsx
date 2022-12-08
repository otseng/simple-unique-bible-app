import React from 'react';
import Container from './container'
import getConfig from 'next/config';
import { isDev } from '../lib/util';
import { useLang } from '../lang/langContext';


const Footer = () => {

  const {lang, setLang} = useLang()
  const { publicRuntimeConfig } = getConfig();
  const version = publicRuntimeConfig?.version

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <Container>
          <div className="flex justify-center items-center pt-5 pb-5 text-sm font-bold text-slate-400">
            {isDev() && <span>(Dev Mode)&nbsp;</span>}
            <a href="https://github.com/otseng/simple-unique-bible-viewer/blob/main/CHANGELOG.md" target="new">{lang.Version}: {version}</a>&nbsp;&bull;&nbsp;
            <a href="https://github.com/eliranwong/UniqueBible" target="new">Unique Bible App</a>
        </div>
      </Container>
    </footer>
  )
}

export default Footer

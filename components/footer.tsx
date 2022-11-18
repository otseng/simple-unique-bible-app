import React from 'react';
import Container from './container'
import getConfig from 'next/config';


const Footer = () => {

  const { publicRuntimeConfig } = getConfig();
  const version = publicRuntimeConfig?.version

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <Container>
          <div className="flex justify-center items-center pt-5 pb-5 text-sm font-bold text-slate-400">
            Version: {version} &bull;&nbsp;
            <a href="https://github.com/eliranwong/UniqueBible" target="new">Unique Bible App</a>
        </div>
      </Container>
    </footer>
  )
}

export default Footer

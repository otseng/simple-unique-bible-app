import { AppProps } from 'next/app'
import { LangProvider, useLang } from '../lang/langContext'
import { langs } from '../lang/languages'
import '../styles/index.css'

export default function MyApp({ Component, pageProps }: AppProps) {

  const {lang, setLang} = useLang()

  return (
    <LangProvider>
      <Component {...pageProps} />
    </LangProvider>
  )
}

import { AppProps } from 'next/app'
import { LangProvider } from '../lang/langContext'
import '../styles/index.css'

export default function MyApp({ Component, pageProps }: AppProps) {

  return (
    <LangProvider>
      <Component {...pageProps} />
    </LangProvider>
  )
}

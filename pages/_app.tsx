import { AppProps } from 'next/app'
import { LangProvider } from '../lang/langContext'
import { ThemeProvider } from '../theme/themeContext'
import '../styles/index.css'

export default function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ThemeProvider>
      <LangProvider>
        <Component {...pageProps} />
      </LangProvider>
    </ThemeProvider>

  )
}

import { AppProps } from 'next/app'
import { LangProvider } from '../lang/langContext'
import { ThemeProvider } from '../theme/themeContext'
import '../styles/index.css'
import ReactGA from "react-ga4";

export default function MyApp({ Component, pageProps }: AppProps) {

    ReactGA.initialize("G-GZTFH5YKRF");

    return (
        <ThemeProvider>
        <LangProvider>
            <Component {...pageProps} />
        </LangProvider>
        </ThemeProvider>

    )
}

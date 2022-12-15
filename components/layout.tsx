import { useLang } from '../lang/langContext'
import { langs } from '../lang/languages'
import { getLang } from '../lang/langUtil'
import { useTheme } from '../theme/themeContext'
import { themes } from '../theme/themes'
import { getTheme } from '../theme/themeUtil'
import Footer from './footer'
import Meta from './meta'

type Props = {
  preview?: boolean
  children: React.ReactNode
}

const Layout = ({ preview, children }: Props) => {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  setLang(langs[getLang()])
  const currentTheme = getTheme()
  setTheme(themes[currentTheme])

  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
      <div className="h-9"></div>
      <Footer />
      <span className="font-serif font-sans bg-blue-800 bg-blue-700" />
      <span className="text-purple-400" />
      <span className="text-neutral-300" />
      <span className="bg-blue-500" />
    </>
  )
}

export default Layout

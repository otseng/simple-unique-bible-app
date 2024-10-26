import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useLang } from '../lang/langContext'
import { useTheme } from '../theme/themeContext'
import { isPowerMode, processLexiconData } from '../lib/util'
import NoSsr from './NoSsr'
import { _getLexicon } from '../lib/api'

export default function BasicModal(props) {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  const [title, setTitle] = useState('')
  const [generatedHtml, setGeneratedHtml] = useState('')
  const [localRefresh, setLocalRefresh] = useState(false)
  
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!localRefresh) {
      setTitle(props.title)
      setHtmlContent(props.content)
    }
  });

  // no values works for all lexicons on initial load
  
  function setHtmlContent(content) {
    setGeneratedHtml(renderHtml(content))
  }

  function renderHtml(content) {
    let data = ""
    let lines = content.split("\n")
    return (lines.map((line, j) => {
      if (line.startsWith("Hebrew:") || line.startsWith("Greek:") || line.startsWith("Names:") || line.startsWith("Places:")) {
        const lang = line.split(":")[0]
        const words = line.split(":")[1].split(",")
        return (<span key={j}>{lang}:&nbsp;
        {words.map((word, i) => {
          let regex = new RegExp("\('(.*?)'\).*>(.*?)<")
          let matches = regex.exec(word)
          let comma = i < words.length - 1 ? ", " : ""
          if (matches) {
            return  <NoSsr><a key={i} href='#' onClick={() => showLexicon(matches[2])}>{matches[3]}{comma}</a></NoSsr>
          } else {
            return <span key={i} >{word}{comma}</span>
          }
        })}</span>)
      } else {
        return <span key={j} dangerouslySetInnerHTML={{__html: line}} />
      }
    }))
  }

  function showLexicon(strongs) {
    setLocalRefresh(true)
    setTitle(strongs)
    try {
      _getLexicon('TRLIT', strongs).then((resp) => {
        const html = processLexiconData(resp[0])
        if (!html.includes("[Not found]")) {
          setHtmlContent(html)
        } else {
          _getLexicon('SECE', strongs).then((resp) => {
            if (resp[0] != "[Not found]") {
              const html = resp[0]?.replaceAll('<a href', '<a target="new" href')
              setHtmlContent(html)
            }
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Transition.Root show={props.show} as={Fragment}>
      <Dialog as="div" className="relative z-60 " open={props.show} initialFocus={buttonRef} onClose={props.setter}>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Dialog.Panel className={theme.backgroundStyle + " relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"}>
                <NoSsr>
                <div className={theme.backgroundStyle + " px-4 pt-5 sm:p-6 overflow-y-scroll border-2 border-solid border-white"}>
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className={theme.backgroundStyle + " text-lg font-medium leading-6"}>
                        {title}
                      </Dialog.Title>
                      <div className={theme.backgroundStyle + "mt-2"}>
                        {generatedHtml}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={theme.backgroundStyle + " flex justify-center items-center mb-5 border-2 border-solid border-white"}>
                  {isPowerMode() && props.strongsModal && 
                    <button
                      type="button"
                      className={theme.clickableButton}
                      onClick={() => props.searchStrongs()}
                      ref={buttonRef}
                    >
                      {lang.Search}
                    </button>
                  }
                  <button
                    type="button"
                    className={theme.clickableButton}
                    onClick={() => props.setter(false)}
                    ref={buttonRef}
                  >
                    {lang.Close}
                  </button>
                </div>
                </NoSsr>
              </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

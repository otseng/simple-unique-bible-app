import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useLang } from '../lang/langContext'
import { useTheme } from '../theme/themeContext'
import { isPowerMode } from '../lib/util'

export default function BasicModal(props) {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  const buttonRef = useRef(null)

  function renderHtml(content) {
    let data = ""
    let lines = content.split("\n")
    return (lines.map((line) => {
      if (line.startsWith("Hebrew:") || line.startsWith("Greek:") || line.startsWith("Names:") || line.startsWith("Places:")) {
        const lang = line.split(":")[0]
        const words = line.split(":")[1].split(",")
        return (<span>{lang}:&nbsp;
        {words.map((word, i) => {
          let regex = new RegExp("\('(.*?)'\).*>(.*?)<")
          let matches = regex.exec(word)
          let comma = i < words.length - 1 ? ", " : ""
          if (matches) {
            return <a href={`${props.hash}`} onClick={() => props.showLexicon(matches[2])}>{matches[3]}{comma}</a>
          } else {
            return <span>{word}{comma}</span>
          }
        })}</span>)
      } else {
        return <span dangerouslySetInnerHTML={{__html: line}} />
      }
    }))
  }

  return (
    <Transition.Root show={props.show} as={Fragment}>
      <Dialog as="div" className="relative z-60" open={props.show} initialFocus={buttonRef} onClose={props.setter}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={theme.backgroundStyle + " relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"}>
                <div className={theme.backgroundStyle + " px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-scroll"}>
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className={theme.backgroundStyle + " text-lg font-medium leading-6"}>
                        {props.title}
                      </Dialog.Title>
                      <div className={theme.backgroundStyle + "mt-2"}>
                        {
                          renderHtml(props.content)
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className={theme.backgroundStyle + " flex justify-center items-center mt-2 mb-5"}>
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

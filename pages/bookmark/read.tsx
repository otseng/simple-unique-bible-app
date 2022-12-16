
import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../lib/constants'
import { addBookmark, bookmarkExists, preloadData } from '../../lib/util'
import { Disclosure } from '@headlessui/react'
import QRCode from 'react-qr-code'
import toast from 'react-hot-toast'
import { useLang } from '../../lang/langContext'
import { useTheme } from '../../theme/themeContext'

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()
  
  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const bm = router.query.bm
  let bookmarks = []

  if (typeof bm === 'undefined') {
  } else if (typeof bm === 'string') {
    bookmarks.push(bm)
  } else {
    bookmarks = bookmarks.concat(bm)
  }

  function copyAll() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window?.location?.href)
      toast('Shared bookmarks link copied to clipboard')
    }
  }

  function addBookmarks() {
    bookmarks.map((url) => {
      if (!bookmarkExists(url)) {
        addBookmark(url)
      }
    })
    toast('Bookmarks saved')
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro currentPage="Shared bookmarks" />

          <Disclosure defaultOpen>
            <Disclosure.Button className={`${theme.homeDisclosure}`}>
              <div className="text-2xl">{lang.Shared_bookmarks}</div>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
              <div>
                {bookmarks.length == 0 && <p className="ml-10 mt-10 font-lg">{lang.No_bookmarks}</p>}
                {bookmarks.map((bookmark) => {
                  if (bookmark) {
                    bookmark = bookmark.replaceAll('!', '#')

                    const regex = new RegExp("/bible/(.*)/(.*)/(.*)#v.*_(.*)")
                    const matches = regex.exec(bookmark)
                    const text = matches[1]
                    const book = matches[2]
                    const chapter = matches[3]
                    const verse = matches[4]

                    return (
                      <>
                        <div className="ml-10 flex justify-left">
                          <Link href={bookmark}>
                            <button className={`${theme.clickableButton}`}>{text} {book} {chapter}:{verse}</button>
                          </Link>
                        </div>
                      </>
                    )
                  }
                })
                }
              </div>

              {(bookmarks.length > 0 && typeof window !== 'undefined') &&
                <>
                  <div className="flex justify-center p-1 text-lg font-bold text-black">{lang.Share_bookmarks}</div>
                  <div className="flex justify-center p-1">
                    <div style={{ height: "auto", margin: "0 auto", maxWidth: 300, width: "400" }}>
                      <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={window?.location?.href}
                        viewBox={`0 0 256 256`}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center p-1">
                    <button onClick={copyAll} className={`${theme.clickableButton}`}>{lang.Copy_to_clipboard}</button>
                  </div>
                  <div className="flex justify-center p-1">
                    <button onClick={addBookmarks} className={`${theme.clickableButton}`}>{lang.Save_bookmarks}</button>
                  </div>
                </>
              }

            </Disclosure.Panel>
          </Disclosure>

        </Container>
      </Layout>
    </>
  )
}

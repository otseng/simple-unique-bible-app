import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME, DOMAIN } from '../../lib/constants'
import { deleteBookmark, getBookmarks, isDev, preloadData, setLocalStorage } from '../../lib/util'
import { Disclosure } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import QRCode from 'react-qr-code'
import { useLang } from '../../lang/langContext'
import { useTheme } from '../../theme/themeContext'
import NoSsr from '../../components/NoSsr'

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()

  const [bookmarksUrl, setBookmarksUrl] = useState('')

  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    setBookmarks(getBookmarks())
    buildUrl()
  }, []);

  function deleteOne(bookmark) {
    deleteBookmark(bookmark)
    setBookmarks(getBookmarks())
    buildUrl()
  }

  function deleteAll() {
    setLocalStorage('bookmarks', [])
    setBookmarks(getBookmarks())
    buildUrl()
  }

  function buildUrl() {
    let url = ''
    if (typeof window !== 'undefined') {
      if (isDev()) {
        url = "http://localhost:3000/bookmark/read?bm=" + getBookmarks().join("&bm=")
      } else {
        url = DOMAIN + "/bookmark/read?bm=" + getBookmarks().join("&bm=")
      }
      url = url.replaceAll("#", '!').replaceAll('+', '%2B')
    }
    setBookmarksUrl(url)
  }

  function copyAll() {
    navigator.clipboard.writeText(bookmarksUrl)
    toast('Shared bookmarks link copied to clipboard')
  }

  function importBookmarks() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.readText().then((importString) => {
        console.log(importString)
        setBookmarks(JSON.parse(importString))
      })
    }
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro currentPage="Bookmarks" />

          <Disclosure defaultOpen>
            <Disclosure.Button className={`${theme.homeDisclosure}`}>
              <div className="text-2xl">{lang.Bookmarks}</div>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
              <div>
                {bookmarks.length == 0 && 
                  <>
                  <p className="ml-10 mt-10 font-lg">No bookmarks</p>

                  <div className="flex justify-center p-1 mt-10">
                    <button onClick={importBookmarks} className={`${theme.clickableButton}`}>Import bookmarks from clipboard</button>
                  </div>
                  </>
                }
                {bookmarks && bookmarks.map((bookmark) => {
                  if (bookmark) {
                    bookmark = bookmark.replaceAll('!', '#')
                    let regex = new RegExp("/bible/(.*)/(.*)/(.*)#v.*_(.*)")
                    let matches = regex.exec(bookmark)
                    if (matches) {
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
                            <button id={bookmark} onClick={() => deleteOne(bookmark)} className={`${theme.clickableButton}`}>{lang.Delete}</button>
                          </div>
                        </>
                      )
                    }
                    regex = new RegExp("/book/(.*)/(.*)")
                    matches = regex.exec(bookmark)
                    if (matches) {
                      const book = matches[1]
                      const chapter = matches[2]

                      return (
                        <>
                          <div className="ml-10 flex justify-left">
                            <Link href={bookmark}>
                              <button className={`${theme.clickableButton}`}>{book} / {chapter}</button>
                            </Link>
                            <button id={bookmark} onClick={() => deleteOne(bookmark)} className={`${theme.clickableButton}`}>{lang.Delete}</button>
                          </div>
                        </>
                      )
                    }

                  }

                })
                }
                {bookmarks.length > 0 &&
                  <>
                    <div className="flex justify-center p-1 text-xl font-bold">{lang.Share_bookmarks}</div>
                    <div className="flex justify-center p-1">
                      <div style={{ height: "auto", margin: "0 auto", maxWidth: 300, width: "400" }}>
                        <NoSsr>
                        <QRCode
                          size={256}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                          value={bookmarksUrl}
                          viewBox={`0 0 256 256`}
                        />
                        </NoSsr>
                      </div>
                    </div>
                    <div className="flex justify-center p-1">
                      <button onClick={copyAll} className={`${theme.clickableButton}`}>{lang.Copy_to_clipboard}</button>
                    </div>
                    <div className="flex justify-center p-1">
                      <button onClick={deleteAll} className={`${theme.clickableButton}`}>{lang.Delete_All}</button>
                    </div>
                  </>
                }
              </div>
            </Disclosure.Panel>
          </Disclosure>

        </Container>
      </Layout>
    </>
  )
}

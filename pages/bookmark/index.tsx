import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME, DOMAIN } from '../../lib/constants'
import { deleteBookmark, getBookmarks, getSermons, isDev, preloadData, pruneSermons, setLocalStorage } from '../../lib/util'
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

  const [sermonsUrl, setSermonsUrl] = useState('')
  const [sermons, setSermons] = useState([]);

  useEffect(() => {
    setBookmarks(getBookmarks())
    pruneSermons()
    setSermons(getSermons())
    buildUrl()
  }, []);

  function deleteOne(bookmark) {
    deleteBookmark(bookmark)
    setBookmarks(getBookmarks())
    buildUrl()
  }

  function deleteAllBookmarks() {
    setLocalStorage('bookmarks', [])
    setBookmarks(getBookmarks())
    buildUrl()
  }

  function deleteAllSermons() {
    setLocalStorage('sermons', [])
    setSermons(getSermons())
    buildUrl()
  }

  function buildUrl() {
    let bookmarksUrl = ''
    if (typeof window !== 'undefined') {
      if (isDev()) {
        bookmarksUrl = "http://localhost:3000/bookmark/read?bm=" + getBookmarks(7).join("&bm=")
      } else {
        bookmarksUrl = DOMAIN + "/bookmark/read?bm=" + getBookmarks(7).join("&bm=")
      }
      bookmarksUrl = bookmarksUrl.replaceAll("#", '!').replaceAll('+', '%2B')
    }
    setBookmarksUrl(bookmarksUrl)

    let sermonsUrl = ''
    if (typeof window !== 'undefined') {
      if (isDev()) {
        sermonsUrl = "http://localhost:3000/bookmark/sermon?bm=" + getSermons().join("&bm=")
      } else {
        sermonsUrl = DOMAIN + "/bookmark/sermon?bm=" + getSermons().join("&bm=")
      }
      sermonsUrl = sermonsUrl.replaceAll("#", '!').replaceAll('+', '%2B')
    }
    setSermonsUrl(sermonsUrl)
  }

  function copyBookmarksToClipboard() {
    navigator.clipboard.writeText(bookmarksUrl)
    toast('Bookmarks link copied to clipboard')
  }

  function copySermonsToClipboard() {
    navigator.clipboard.writeText(sermonsUrl)
    toast('Sermons link copied to clipboard')
  }

  function importBookmarks() {
    if (typeof window !== 'undefined') {
        navigator.clipboard.readText().then((importString) => {
            try {
                setBookmarks(JSON.parse(importString))
                setLocalStorage('bookmarks', JSON.parse(importString))
                buildUrl()
            } catch (error) {
                toast("Could not import bookmarks")
            }
        })
    }
  }

  function exportBookmarks() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(JSON.stringify(bookmarks))
      // console.log(JSON.stringify(bookmarks))
      toast('Exported bookmarks to clipboard')
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
                    {/* <div className="flex justify-center p-1 text-xl font-bold `${theme.textColor}`">{lang.Share_bookmarks}</div> */}
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
                      <button onClick={copyBookmarksToClipboard} className={`${theme.clickableButton}`}>Copy link to clipboard</button>
                    </div>
                    <div className="flex justify-center p-1">
                      <button onClick={importBookmarks} className={`${theme.clickableButton}`}>Import bookmarks from clipboard</button>
                    </div>
                    <div className="flex justify-center p-1">
                      <button onClick={exportBookmarks} className={`${theme.clickableButton}`}>Export bookmarks to clipboard</button>
                    </div>
                    <div className="flex justify-center p-1">
                      <button onClick={deleteAllBookmarks} className={`${theme.clickableButton}`}>{lang.Delete_All}</button>
                    </div>
                  </>
                }
                {sermons.length > 0 && 
                    <>
                    <div className="text-2xl ml-10">{lang.Sermon_bookmarks}</div>
                    </>
                }
                {sermons.length > 0 && sermons.map((sermon) => {
                  if (sermon) {
                    sermon = sermon.replaceAll('!', '#')
                    let regex = new RegExp("/bible/(.*)/(.*)/(.*)#v.*_(.*)")
                    let matches = regex.exec(sermon)
                    if (matches) {
                      const text = matches[1]
                      const book = matches[2]
                      const chapter = matches[3]
                      const verse = matches[4]

                      return (
                        <>
                          <div className="ml-10 flex justify-left">
                            <Link href={sermon}>
                              <button className={`${theme.clickableButton}`}>{text} {book} {chapter}:{verse}</button>
                            </Link>
                          </div>
                        </>
                      )
                    }
                  }
                })
                }
                {sermons.length > 0 && 
                    <>
                     <div className="flex justify-center p-1">
                      <div style={{ height: "auto", margin: "0 auto", maxWidth: 300, width: "400" }}>
                        <NoSsr>
                        <QRCode
                          size={256}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                          value={sermonsUrl}
                          viewBox={`0 0 256 256`}
                        />
                        </NoSsr>
                        {/* <Link href={sermonsUrl}>
                              <button className={`${theme.clickableButton}`}>sermonsUrl</button>
                        </Link> */}
                        <div className="flex justify-center p-1">
                            <button onClick={copySermonsToClipboard} className={`${theme.clickableButton}`}>Copy link to clipboard</button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center ">
                      <button onClick={deleteAllSermons} className={`${theme.clickableButton}`}>{lang.Delete_All}</button>
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

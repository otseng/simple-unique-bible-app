import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../lib/constants'
import { deleteBookmark, getBookmarks, isDev, preloadData, setLocalStorage } from '../../lib/util'
import { clickableButton, homeDisclosure } from '../../lib/styles'
import { Disclosure } from '@headlessui/react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import QRCode from 'react-qr-code'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()

  const [bookmarksUrl, setBookmarksUrl] = useState('')

  let bookmarks = getBookmarks()
  if (bookmarksUrl == '' && bookmarks.length > 0) {
    const url = buildUrl()
    setBookmarksUrl(url)
  }

  function deleteOne(bookmark) {
    deleteBookmark(bookmark)
    bookmarks = getBookmarks()
    const url = buildUrl()
    setBookmarksUrl(url)
  }

  function deleteAll() {
    setLocalStorage('bookmarks', [])
    bookmarks = getBookmarks()
    const url = buildUrl()
    setBookmarksUrl(url)
  }

  function buildUrl() {
    let url = ''
    if (typeof window !== 'undefined') {
      if (isDev()) {
        url = "http://localhost:3000/bookmark/read?bm=" + bookmarks.join("&bm=")
      } else {
        url = "https://simple.uniquebibleapp.com/bookmark/read?bm=" + bookmarks.join("&bm=")
      }
      url = url.replaceAll("#", '!').replaceAll('+', '%2B')
    }
    return url
  }

  function copyAll() {
    navigator.clipboard.writeText(bookmarksUrl)
    toast('Shared bookmarks link copied to clipboard')
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
            <Disclosure.Button className={`${homeDisclosure}`}>
              <div className="text-2xl">Bookmarks</div>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
              <div>
                {bookmarks.length == 0 && <p className="ml-10 mt-10 font-lg">No bookmarks</p>}
                {bookmarks.map((bookmark) => {
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
                              <button className={`${clickableButton}`}>{text} {book} {chapter}:{verse}</button>
                            </Link>
                            <button id={bookmark} onClick={() => deleteOne(bookmark)} className={`${clickableButton}`}>Delete</button>
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
                              <button className={`${clickableButton}`}>{book} / {chapter}</button>
                            </Link>
                            <button id={bookmark} onClick={() => deleteOne(bookmark)} className={`${clickableButton}`}>Delete</button>
                          </div>
                        </>
                      )
                    }

                  }

                })
                }
                {bookmarks.length > 0 &&
                  <>
                    <div className="flex justify-center p-1 text-lg font-bold text-black">Share bookmarks</div>
                    <div className="flex justify-center p-1">
                      <div style={{ height: "auto", margin: "0 auto", maxWidth: 300, width: "400" }}>
                        <QRCode
                          size={256}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                          value={bookmarksUrl}
                          viewBox={`0 0 256 256`}
                        />
                      </div>
                    </div>
                    <div className="flex justify-center p-1">
                      <button onClick={copyAll} className={`${clickableButton}`}>Copy to clipboard</button>
                    </div>
                    <div className="flex justify-center p-1">
                      <button onClick={deleteAll} className={`${clickableButton}`}>Delete All</button>
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

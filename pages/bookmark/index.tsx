import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../lib/constants'
import { deleteBookmark, getBookmarks, preloadData, setLocalStorage } from '../../lib/util'
import { clickableButton, homeDisclosure } from '../../lib/styles'
import { Disclosure } from '@headlessui/react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const bm = router.query.bm
  if (bm) {
    console.log("!!! found bm")
    // console.log(bm)
  }

  const [refresh, setRefresh] = useState([])

  let bookmarks = getBookmarks()

  function deleteOne(bookmark) {
    deleteBookmark(bookmark)
    bookmarks = getBookmarks()
    setRefresh(bookmarks)
  }

  function deleteAll() {
    setLocalStorage('bookmarks', [])
    bookmarks = getBookmarks()
    setRefresh(bookmarks)
  }

  function copyAll() {
    const url = window.location.protocol + "//" + window.location.host + "/bookmark?bm=" + bookmarks.join("&bm=")
    console.log(url)
    navigator.clipboard.writeText(url)
    toast('Link copied to clipboard')
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
                          <button className={`${clickableButton}`}>{text} {book} {chapter}:{verse}</button>
                        </Link>
                        <button id={bookmark} onClick={() => deleteOne(bookmark)} className={`${clickableButton}`}>Delete</button>
                      </div>
                    </>
                  )
                })
                }
                {bookmarks.length > 1 &&
                  <div className="flex justify-center p-1">
                      {/* <button onClick={copyAll} className={`${clickableButton}`}>Copy all bookmarks to clipboard</button> */}
                      <button onClick={deleteAll} className={`${clickableButton}`}>Delete All</button>
                  </div>
                }
              </div>
            </Disclosure.Panel>
          </Disclosure>

        </Container>
      </Layout>
    </>
  )
}

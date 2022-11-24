import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../lib/constants'
import { deleteBookmark, getBookmarks, preloadData } from '../../lib/util'
import { clickableButton, homeDisclosure } from '../../lib/styles'
import { Disclosure } from '@headlessui/react'
import { useState } from 'react'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const [refresh, setRefresh] = useState([])

  let bookmarks = getBookmarks()

  function deleteIt(bookmark) {
    deleteBookmark(bookmark)
    bookmarks = getBookmarks()
    setRefresh(bookmarks)
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
                        <button id={bookmark} onClick={() => deleteIt(bookmark)} className={`${clickableButton}`}>Delete</button>
                      </div>
                    </>
                  )
                })}
              </div>
            </Disclosure.Panel>
          </Disclosure>

        </Container>
      </Layout>
    </>
  )
}

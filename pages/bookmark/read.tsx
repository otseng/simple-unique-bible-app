
import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../lib/constants'
import { preloadData } from '../../lib/util'
import { clickableButton, homeDisclosure } from '../../lib/styles'
import { Disclosure } from '@headlessui/react'

export default function Index() {

  if (!globalThis.bibleBooks) preloadData()

  const router = useRouter()
  const bm = router.query.bm
  console.log(bm)
  let bookmarks = []
  bookmarks = bookmarks.concat(bm)

  return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro currentPage="Shared bookmarks" />

          <Disclosure defaultOpen>
            <Disclosure.Button className={`${homeDisclosure}`}>
              <div className="text-2xl">Shared bookmarks</div>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
              <div>
                {bookmarks.length == 0 && <p className="ml-10 mt-10 font-lg">No bookmarks</p>}
                {bookmarks.map((bookmark) => {
                  if (bookmark) {
                    bookmark = bookmark.replaceAll('!','#')
                    console.log(bookmark)
                    // return (<></>)

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
                          <Link target={bookmark} href={bookmark}> 
                            <button className={`${clickableButton}`}>New tab</button>
                          </Link>
                        </div>
                      </>
                    )
                    }
                })
                }
              </div>
            </Disclosure.Panel>
          </Disclosure>

        </Container>
      </Layout>
    </>
  )
}

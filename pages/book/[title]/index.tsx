import Container from '../../../components/container'
import Intro from '../../../components/intro'
import Layout from '../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../lib/constants'
import { getBookChapters, getBooks } from '../../../lib/api'
import { clickableButton, homeDisclosure } from '../../../lib/styles'
import React, { useState } from 'react'
import { Disclosure } from '@headlessui/react'
import Input from 'rc-input'
import { useLang } from '../../../lang/langContext'

export default function Index() {

  const {lang, setLang} = useLang()
  
  const router = useRouter()
  const title = router.query.title as string

  const [filteredData, setFilteredData] = React.useState([]);
  const [searchText, setSearchText] = useState('');

  const { data: dataBooks, loading: loadingBooks, error: errorBooks } = getBooks()
  const { data: dataChapters, loading: loadingChapters, error: errorChapters } = getBookChapters(title)

  function searchTextChange(event) {
    if (event.target.value.length <= 2) {
      for (const chapter of dataChapters) {
        const element = document.getElementById(chapter)
        if (element) {
          element.hidden = false
        }
      }
    } else if (event.target.value.length > 2) {
      for (const chapter of dataChapters) {
        const element = document.getElementById(chapter)
        if (element) {
          if (chapter.toLowerCase().includes(event.target.value.toLowerCase())) {
            element.hidden = false
          } else {
            element.hidden = true
          }
        }
      }
    }
    setSearchText(event.target.value)
  }

  if (errorChapters) return <div>Failed to load</div>
  if (loadingChapters) return

  if (dataChapters && dataBooks) {
    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="Books" />

            <Disclosure>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">Books</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataBooks.map((title) => (
                    <Link href={"/book/" + title}>
                      <button className={`${clickableButton}`}>
                        {title.replaceAll('_', ' ')}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">{title.replaceAll('_', ' ')}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div className="flex justify-center items-center">
                  <Input id="search-text" className="w-1/2 p-2 border-blue-300 border-2 border-solid"
                    type="text" value={searchText}
                    onChange={searchTextChange} />
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <div>
              {dataChapters.map((chapter) => (
                <Link id={chapter} href={"/book/" + title + '/' + chapter.replaceAll("/", "_")}>
                  <button className={`${clickableButton}`}>{chapter.replaceAll("/", "_")}</button>
                </Link>
              ))}
            </div>

          </Container>
        </Layout>
      </>
    )
  }
}


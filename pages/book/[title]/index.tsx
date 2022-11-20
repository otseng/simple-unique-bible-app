import Container from '../../../components/container'
import Intro from '../../../components/intro'
import Layout from '../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../lib/constants'
import { getBookChapters, getBooks } from '../../../lib/api'
import { chapterDisclosure, clickableButton, homeDisclosure, nonclickableButton } from '../../../lib/styles'
import React from 'react'
import { Disclosure } from '@headlessui/react'

export default function Index() {

  const router = useRouter()
  const title = router.query.title as string

  const [filteredData, setFilteredData] = React.useState([]);

  const { data: dataBooks, loading: loadingBooks, error: errorBooks } = getBooks()
  const { data: dataChapters, loading: loadingChapters, error: errorChapters } = getBookChapters(title)

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

            <Disclosure defaultOpen>
              <Disclosure.Button className={`${homeDisclosure}`}>
                <div className="text-2xl">{title.replaceAll('_', ' ')}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataChapters.map((chapter) => (
                    <Link href={"/book/" + title + '/' + chapter.replaceAll("/", "_")}>
                      <button className={`${clickableButton}`}>{chapter.replaceAll("/", "_")}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

          </Container>
        </Layout>
      </>
    )
  }

  function handleChange(event) {
    console.log(event.target.value);
    // this.filteredData = this.data.filter(name => (name.includes(event.target.value)))
  }
}


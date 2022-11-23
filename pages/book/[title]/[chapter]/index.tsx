import Container from '../../../../components/container'
import Intro from '../../../../components/intro'
import Layout from '../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../lib/constants'
import { getBookChapters, getBookChapterContent, getBooks } from '../../../../lib/api'
import { chapterDisclosure, clickableButton, homeDisclosure } from '../../../../lib/styles'
import { Disclosure } from '@headlessui/react'

export default function Index() {

  const router = useRouter()
  const title = router.query.title as string
  const chapter = router.query.chapter as string

  const { data: dataBooks, loading: loadingBooks, error: errorBooks } = getBooks()
  const { data: dataChapters, loading: loadingChapters, error: errorChapters } = getBookChapters(title)
  const { data, loading, error } = getBookChapterContent(title, chapter)

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (data && dataBooks && dataChapters) {

    const navigation = getNavigation(dataChapters, chapter)

    let html = data
    if (title.includes('Hymn Lyrics')) {
      html = data.replace(/<ref.*\/ref>/, '')
    }

    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro currentPage="Books"/>

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
                <div>
                  {dataChapters.map((chapter) => (
                    <Link href={"/book/" + title + '/' + chapter.replaceAll("/", "_")}>
                      <button className={`${clickableButton}`}>{chapter.replaceAll("/", "_")}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${chapterDisclosure}`}>
                <div>{chapter}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                {navigation.previous &&
                  <Link href={"/book/" + title + '/' + navigation.previous}>
                    <button className={`${clickableButton}`}>{navigation.previous}</button>
                  </Link>}
                {navigation.next &&
                  <Link href={"/book/" + title + '/' + navigation.next}>
                    <button className={`${clickableButton}`}>{navigation.next}</button>
                  </Link>}
              </Disclosure.Panel>
            </Disclosure>

            <div className="text-container" dangerouslySetInnerHTML={{ __html: html }} />

            {navigation.previous &&
              <Link href={"/book/" + title + '/' + navigation.previous}>
                <button className={`${clickableButton}`}>Previous</button>
              </Link>}
            {navigation.next &&
              <Link href={"/book/" + title + '/' + navigation.next}>
                <button className={`${clickableButton}`}>Next</button>
              </Link>}

          </Container>
        </Layout>
      </>
    )
  }
}

function getNavigation(dataChapters, chapter) {
  let previous = ''
  let next = ''
  console.log(chapter)
  for (let i = 0; i < dataChapters.length; i++) {
    if (dataChapters[i] == chapter) {
      console.log(dataChapters[i])
      if (i > 0) {
        previous = dataChapters[i - 1]
      }
      if (i < dataChapters.length) {
        next = dataChapters[i + 1]
      }
    }
  }
  return { previous: previous, next: next }
}
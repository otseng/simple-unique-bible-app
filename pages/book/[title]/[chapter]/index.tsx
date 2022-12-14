import Container from '../../../../components/container'
import Intro from '../../../../components/intro'
import Layout from '../../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../../lib/constants'
import { getBookChapters, getBookChapterContent, getBooks } from '../../../../lib/api'
import { Disclosure } from '@headlessui/react'
import toast from 'react-hot-toast'
import { bookmarkExists, addBookmark, deleteBookmark, windowExists } from '../../../../lib/util'
import { useState } from 'react'
import Input from 'rc-input'
import { useLang } from '../../../../lang/langContext'
import { useTheme } from '../../../../theme/themeContext'

export default function Index() {

  const {lang, setLang} = useLang()
  const {theme, setTheme} = useTheme()

  const router = useRouter()
  const title = router.query.title as string
  const chapter = router.query.chapter as string

  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');

  let url = ''

  if (windowExists()) {
    url = window.location.protocol + '//' + window.location.host + `/book/${title}/${chapter}`
  }

  let bookmarkExist = bookmarkExists(url)

  const [chapterBookmarked, setChapterBookmarked] = useState(bookmarkExists(url))

  const { data: dataBooks, loading: loadingBooks, error: errorBooks } = getBooks()
  const { data: dataChapters, loading: loadingChapters, error: errorChapters } = getBookChapters(title)
  const { data, loading, error } = getBookChapterContent(title, chapter)

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

  function addChapterBookmark() {
    toast.dismiss()
    if (bookmarkExists(url)) {
      toast('Bookmark exists')
    } else {
      addBookmark(url)
      toast('Bookmark added')
      setChapterBookmarked(true)
    }
  }

  function deleteChapterBookmark() {
    toast.dismiss()
    deleteBookmark(url)
    setChapterBookmarked(false)
    toast('Bookmark deleted')
  }

  if (error) return <div>Failed to load</div>
  if (loading) return <div>Loading...</div>

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
            <Intro currentPage="Books" />

            <Disclosure>
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">{lang.Books}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div>
                  {dataBooks.map((title) => (
                    <Link href={"/book/" + title}>
                      <button className={`${theme.clickableButton}`}>{title.replaceAll('_', ' ')}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${theme.homeDisclosure}`}>
                <div className="text-2xl">{title.replaceAll('_', ' ')}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                <div className="flex justify-center items-center">
                  <Input id="search-text" className="w-1/2 p-2 border-blue-300 border-2 border-solid"
                    type="text" value={searchText}
                    onChange={searchTextChange} />
                </div>
                <div>
                  {dataChapters.map((chapter) => (
                    <Link id={chapter} href={"/book/" + title + '/' + chapter.replaceAll("/", "_")}>
                      <button className={`${theme.clickableButton}`}>{chapter.replaceAll("/", "_")}</button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure>
              <Disclosure.Button className={`${theme.chapterDisclosure}`}>
                <div>{chapter}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">
                {navigation.previous &&
                  <Link href={"/book/" + title + '/' + navigation.previous}>
                    <button className={`${theme.clickableButton}`}>{navigation.previous}</button>
                  </Link>}
                {!bookmarkExist && <button onClick={addChapterBookmark} className={`${theme.clickableButton}`}>{lang.Add_bookmark}</button>}
                {bookmarkExist && <button onClick={deleteChapterBookmark} className={`${theme.clickableButton}`}>{lang.Delete_bookmark}</button>}
                {navigation.next &&
                  <Link href={"/book/" + title + '/' + navigation.next}>
                    <button className={`${theme.clickableButton}`}>{navigation.next}</button>
                  </Link>}
              </Disclosure.Panel>
            </Disclosure>

            <div className="text-container" dangerouslySetInnerHTML={{ __html: html }} />

            {navigation.previous &&
              <Link href={"/book/" + title + '/' + navigation.previous}>
                <button className={`${theme.clickableButton}`}>{lang.Previous}</button>
              </Link>}
            {navigation.next &&
              <Link href={"/book/" + title + '/' + navigation.next}>
                <button className={`${theme.clickableButton}`}>{lang.Next}</button>
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
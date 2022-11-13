import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import Head from 'next/head'
import Link from 'next/link';
import { getBibles, getBooks, getCommentaries } from '../lib/api'
import Spinner from 'react-bootstrap/Spinner';
import { APP_NAME } from '../lib/constants';
import { clickableButton } from '../lib/styles';

export default function Index() {

  const { data: dataBible, loading: loadingBible, error: errorBible } = getBibles()
  const { data: dataCommentary, loading: loadingCommentary, error: errorCommentary } = getCommentaries()
  const { data: dataBooks, loading: loadingBooks, error: errorBooks } = getBooks()

  if (errorBible || errorBooks || errorCommentary ) return <div>Failed to load</div>
  if (loadingBible || loadingBooks || loadingCommentary ) return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )
  if (dataBible && dataBooks && dataCommentary) return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro />
          <div className="grid grid-cols-3 ml-10">
            <div>
              <div className="text-2xl">Bibles</div>
                {dataBible.map((text) => (
                  <Link href={"/bible/" + text}>
                      <button className={`${clickableButton}`}>{text}</button>
                  </Link>
                ))}
            </div>

            <div>              
              <div className="text-2xl">
                Comm<span className="invisible md:visible">entaries</span>
              </div>
                {dataCommentary.map((commentary) => (
                  <Link href={"/commentary/" + commentary}>
                    <button className={`${clickableButton}`}>
                    {commentary.replaceAll('_', ' ')}
                    </button>
                  </Link>
                ))}
            </div>

            <div>              
              <div className="text-2xl">Books</div>
                {dataBooks.map((title) => (
                  <Link href={"/book/" + title}>
                    <button className={`${clickableButton}`}>
                    {title.replaceAll('_', ' ')}</button>
                  </Link>
                ))}
            </div>
          </div>

        </Container>
      </Layout>
    </>
  )
}


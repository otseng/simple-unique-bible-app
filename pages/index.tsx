import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import Head from 'next/head'
import Link from 'next/link';
import { getBibles, getBooks } from '../lib/api'
import Spinner from 'react-bootstrap/Spinner';
import { APP_NAME } from '../lib/constants';

export default function Index() {

  const { data: dataBible, loading: loadingBible, error: errorBible } = getBibles()
  const { data: dataBooks, loading: loadingBooks, error: errorBooks } = getBooks()

  if (errorBible || errorBooks) return <div>Failed to load</div>
  if (loadingBible || loadingBooks) return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )
  if (dataBible && dataBooks) return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro />
          <div className="grid grid-cols-4 gap-3">
            <div></div>
            <div>
              <div className="text-2xl">Bibles</div>
              <ul>
                {dataBible.map((text) => (
                  <li><Link href={"/bible/" + text}>{text}</Link></li>
                ))}
              </ul>
            </div>
            <div>              
              <div className="text-2xl">Books</div>
              <ul>
                {dataBooks.map((title) => (
                  <li><Link href={"/book/" + title}>{title}</Link></li>
                ))}
              </ul>
            </div>
            <div></div>
          </div>

        </Container>
      </Layout>
    </>
  )
}


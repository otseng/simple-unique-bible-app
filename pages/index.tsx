import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import Head from 'next/head'
import Link from 'next/link';
import { getBibleBooks, getBibles } from '../lib/api'
import Spinner from 'react-bootstrap/Spinner';
import { APP_NAME } from '../lib/constants';

export default function Index() {

  const { data, loading, error } = getBibles()

  if (error) return <div>Failed to load</div>
  if (loading) return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )
  if (data) return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro />
          <ul>
            {data.map((text) => (
              <li><Link href={"/bible/" + text}>{text}</Link></li>
            ))}
          </ul>
        </Container>
      </Layout>
    </>
  )
}

import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import Head from 'next/head'
import useSWR from 'swr'
import axios from 'axios'

export default function Index() {

  const address = 'http://localhost:8080/bible';
  const fetcher = async (url) => await axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(address, fetcher);

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <>
      <Layout>
        <Head>
          <title>UBUI - Unique Bible UI</title>
        </Head>
        <Container>
          <Intro />
          <ul>
            {data.data.map((bible) => (
              <li>{bible}</li>
            ))}
          </ul>
        </Container>
      </Layout>
    </>
  )
}

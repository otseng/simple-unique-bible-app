import Container from '../../../components/container'
import Intro from '../../../components/intro'
import Layout from '../../../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { APP_NAME } from '../../../lib/constants'
import { getBookChapters } from '../../../lib/api'
import { clickableButton, nonclickableButton } from '../../../lib/styles'
import React from 'react'

export default function Index() {

  const router = useRouter()
  const title = router.query.title as string

  const [filteredData, setFilteredData] = React.useState([]);


  const { data, loading, error } = getBookChapters(title)

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (data) {
    return (
      <>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Container>
            <Intro />
            <div className="text-xl"><button className={`${nonclickableButton}`}>{title.replaceAll('_', ' ')}</button></div>
            <p>&nbsp;</p>
            {/* {data.length > 100 &&
            <p>Filter: <input name="chapterFilter" onChange={handleChange} /><br/></p>} */}
            {data.map((chapter) => (
              <Link href={"/book/" + title + '/' + chapter}>
                <button className={`${clickableButton}`}>{chapter}</button>
              </Link>
            ))}
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


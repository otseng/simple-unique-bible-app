import { Disclosure } from '@headlessui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Container from '../../components/container';
import Intro from '../../components/intro';
import Layout from '../../components/layout';
import { APP_NAME } from '../../lib/constants';
import { clickableButton, homeDisclosure } from '../../lib/styles';

export default function Index() {

  const [searchText, setSearchText] = useState('');

  const router = useRouter()

  useEffect(() => {
    const element = document.getElementById('search-text')
    if (element) {
      element.focus()
    }
  });

  function searchBible() {
    const url = `/search/bible/${searchText}`
    router.push(url)
  }

  function searchTextChange(event) {
    setSearchText(event.target.value)
  }

  function searchTextKeyPress(event) {
    if (event.charCode == 13) {
      searchBible()
    }
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Container>
          <Intro currentPage="Search" />

          <Disclosure defaultOpen>
            <Disclosure.Button className={`${homeDisclosure}`}>
              <div className="text-2xl">Search</div>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">

              <div className="m-10">
                <div className="flex justify-center items-center">
                  <input id="search-text" className="relative z-0 text-red w-1/2 p-2 border-sky-500 border-solid drop-shadow"
                    type="text" value={searchText}
                    onChange={searchTextChange} onKeyPress={searchTextKeyPress} />
                </div>
                <div className="flex justify-center items-center">
                  <button className={`${clickableButton}`} onClick={searchBible}>Search Bible</button>
                </div>
              </div>

            </Disclosure.Panel>
          </Disclosure>

        </Container>
      </Layout>
    </>
  )
}


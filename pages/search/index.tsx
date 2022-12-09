import { Disclosure } from '@headlessui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Container from '../../components/container';
import Intro from '../../components/intro';
import Layout from '../../components/layout';
import { getBibles } from '../../lib/api';
import { APP_NAME } from '../../lib/constants';
import { clickableButton, homeDisclosure } from '../../lib/styles';
import Select from 'react-select'
import Input from 'rc-input';
import { useLang } from '../../lang/langContext';
import { setLocalStorage } from '../../lib/util';
import toast from 'react-hot-toast';

export default function Index() {

  const { lang, setLang } = useLang()

  const router = useRouter()
  let text = router.query.text as string
  if (!text) text = "KJV"

  const [searchText, setSearchText] = useState('');
  const [selectedBible, setSelectedBible] = useState(text);
  const { data, loading, error } = getBibles()

  useEffect(() => {
    const element = document.getElementById('search-text')
    if (element) {
      element.focus()
    }
  });

  function enterCommand() {
    if (searchText.startsWith(".")) {
      processCommand(searchText.substring(1))
    } else {
      searchBible()
    }
    setSearchText("")
  }

  function searchBible() {
    const url = `/search/bible/${searchText}?text=${selectedBible}`
    router.push(url)
  }

  function searchTextChange(event) {
    const text = event.target.value
    if (text.length < 50) {
      setSearchText(text)
    }
  }

  function searchTextKeyPress(event) {
    if (event.charCode == 13) {
      enterCommand()
    }
  }

  function handleBibleChange(e) {
    setSelectedBible(e.value);
  }

  if (error) return <div>Failed to load</div>
  if (loading) return

  if (data) {

    const bibleOptions = data.map((bible) => (
      { value: bible, label: bible }
    ))

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
                <div className="text-2xl">{lang.Search}</div>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500">

                <div className="m-10">
                  <div className="flex justify-center items-center mb-5">
                    <span className="text-lg mr-2">{lang.Bible}:</span>
                    <Select options={bibleOptions}
                      value={bibleOptions.filter(obj => obj.value === selectedBible)}
                      onChange={handleBibleChange}
                    />
                  </div>
                  <div className="flex justify-center items-center">
                    <Input id="search-text" className="w-1/2 p-2 border-blue-300 border-2 border-solid"
                      type="text" value={searchText}
                      onChange={searchTextChange} onKeyPress={searchTextKeyPress} />
                  </div>
                  <div className="flex justify-center items-center">
                    <button className={`${clickableButton}`} onClick={enterCommand}>{lang.Search}</button>
                  </div>
                </div>

              </Disclosure.Panel>
            </Disclosure>

          </Container>
        </Layout>
      </>
    )
  }
}

function processCommand(text: string) {
  const lowerText = text.toLowerCase()
  const cmd = lowerText.split(" ")
  console.log(cmd[0])
  switch (cmd[0]) {
    case 'power':
      if (cmd.length > 1) {
        if (cmd[1] == "off") disablePowerMode()
        else enablePowerMode()
      } else enablePowerMode()
      break;
  }
}

function enablePowerMode() {
  setLocalStorage("powerMode", true)
  toast("Power mode on")
}

function disablePowerMode() {
  setLocalStorage("powerMode", false)
  toast("Power mode off")
}

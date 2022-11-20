import { Menu, Popover, Transition } from '@headlessui/react'
import Link from 'next/link'
import isDev from '../lib/util'

const Intro = (props) => (
  <section className="flex-row flex items-center justify-between mt-10 mb-10">

    <Popover className="relative">
      <Popover.Button className="dropdown-toggle inline-block px-4 py-2.5 bg-indigo-300 hover:bg-indigo-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg active:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap"
      >
        <div className="space-y-1 rounded">
          <span className="block w-4 h-1 bg-gray-600"></span>
          <span className="block w-4 h-1 bg-gray-600"></span>
          <span className="block w-4 h-1 bg-gray-600"></span>
        </div>
      </Popover.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel className="absolute z-10">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5
        w-200">
            <div className="relative grid gap-1 bg-indigo-300 p-3 rounded text-lg text-white font-bold">
              {props.currentPage != 'Home' &&
                <Link href="/"><Popover.Button className="hover:bg-indigo-400 p-1">
                  Home
                </Popover.Button></Link>
              }
              {props.currentPage != 'Bibles' &&
                <Link href="/bible"><Popover.Button className="hover:bg-indigo-400 p-1">
                  Bibles
                </Popover.Button></Link>
              }
              {props.currentPage != 'Devotionals' &&
                <Link href="/devotional"><Popover.Button className="hover:bg-indigo-400 p-1">
                  Devotionals
                </Popover.Button></Link>
              }
              {props.currentPage != 'Books' &&
                <Link href="/book"><Popover.Button className="hover:bg-indigo-400 p-1">
                  Books
                </Popover.Button></Link>
              }
              {props.currentPage != 'Commentaries' &&
                <Link href="/commentary"><Popover.Button className="hover:bg-indigo-400 p-1">
                  Commentaries
                </Popover.Button></Link>
              }
              <Link href="/about"><Popover.Button className="hover:bg-indigo-400 p-1">
                About
              </Popover.Button></Link>
              {isDev() &&
                <Link href="/playground"><Popover.Button className="hover:bg-indigo-400 p-1">
                  Playground
                </Popover.Button></Link>
              }
            </div></div>
        </Popover.Panel>
      </Transition>
    </Popover>

    <div className="text-2xl md:text-3xl font-bold text-blue-400 hover:text-blue-600">
      <Link href="/">
        Simple Unique Bible Viewer
      </Link>
    </div>

  </section>
)

export default Intro

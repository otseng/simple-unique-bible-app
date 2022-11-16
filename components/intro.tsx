import Link from 'next/link'

const Intro = () => {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-10 mb-10 md:mb-12">
      <h1 className="text-3xl md:text-3xl font-bold text-blue-400 hover:text-blue-600">
        <Link href="/">Simple Unique Bible Viewer</Link>
      </h1>
    </section>
  )
}

export default Intro

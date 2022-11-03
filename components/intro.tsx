import Link from 'next/link'

const Intro = () => {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-xl md:text-xl font-bold tracking-tighter leading-tight md:pr-8">
        <Link href="/">Simple Unique Bible</Link>
      </h1>
    </section>
  )
}

export default Intro

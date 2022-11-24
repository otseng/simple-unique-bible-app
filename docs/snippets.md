# Check dev mode

Util.ts
isDev()

# Clickable button

<Link href={"/bible/" + book + "/" + chapter + "/" + verse + "/" + text}>
                      <button className={`${clickableButton}`}>{verse}</button>
                    </Link>

# Output html

 <span className="text-container" dangerouslySetInnerHTML={{ __html: verse.t }} />
 
https://stackoverflow.com/questions/30523800/call-react-component-function-from-onclick-in-dangerouslysetinnerhtml

# Center content

<div className="flex justify-center items-center">

# Help debug build issue

function getStaticProps({ params: {slug} }) {
    console.log(`Building slug: ${slug}`)
}

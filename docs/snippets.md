# yarn

yarn run dev
yarn run build
yarn run start

# yvm

yvm ls
yvm use 

# Styling

https://tailwindcss.com


# Find port in use

lsof -i -P -n | grep 3000

# Check dev mode

Util.ts
isDev()

# Clickable button

<Link href={"/bible/" + book + "/" + chapter + "/" + verse + "/" + text}>
                      <button className={`${clickableButton}`}>{verse}</button>
                    </Link>

# onClick

<button onClick={copyAll} className={`${clickableButton}`}>Copy to clipboard</button>

onClick={() => showLexicon(word)}>

# Output html

 <span dangerouslySetInnerHTML={{ __html: verse.t }} />
 
https://stackoverflow.com/questions/30523800/call-react-component-function-from-onclick-in-dangerouslysetinnerhtml

# Center content

<div className="flex justify-center items-center">

# Help debug build issue

function getStaticProps({ params: {slug} }) {
    console.log(`Building slug: ${slug}`)
}

# Language

const {lang, setLang} = useLang()

{lang.Bibles}

language detection - langutil.ts, container.tsx

language selection - footer.tsx

# Toast

import { toast } from 'react-hot-toast'

toast.dismiss()

# Theme

const {theme, setTheme} = useTheme()

className={`${theme.bibleDivContainer}`}

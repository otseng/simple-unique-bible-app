import React, { useContext, useState } from 'react'
import { langs } from './languages'

export const LangContext = React.createContext({
    lang: undefined,
    setLang: (lang) => null,
})

export const useLang = () => useContext(LangContext)

export const LangProvider = (props) => {
    const [currentLang, setCurrentLang] = useState(langs["en"])

    return (
        <LangContext.Provider value={{ lang: currentLang, setLang: setCurrentLang }}> 
            {props.children} 
        </LangContext.Provider>
    )
}
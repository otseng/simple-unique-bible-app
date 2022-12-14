import React, { useContext, useState } from 'react'
import { themes } from './themes'

export const ThemeContext = React.createContext({
    theme: undefined,
    setTheme: (theme) => null,
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = (props) => {
    const [currentTheme, setCurrentTheme] = useState(themes["default"])

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, setTheme: setCurrentTheme }}> 
            {props.children} 
        </ThemeContext.Provider>
    )
}
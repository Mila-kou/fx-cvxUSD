import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  createContext,
  useContext,
} from 'react'

const ThemeContext = createContext(null)

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('red')

  const handleTheme = useCallback(
    (_theme) => {
      const body = document.querySelector('body')
      body.setAttribute('data-theme', _theme)

      window.localStorage.setItem('theme', _theme)
      setTheme(_theme)
    },
    [setTheme]
  )

  useEffect(() => {
    handleTheme(window.localStorage.getItem('theme') || 'blue')
  }, [])

  const toggleTheme = useCallback(() => {
    const _theme = theme === 'blue' ? 'red' : 'blue'
    handleTheme(_theme)
  }, [handleTheme, theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  )

  return (
    <ThemeContext.Provider value={value}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  )
}

const useTheme = () => useContext(ThemeContext)

export { ThemeContext, useTheme }

export default ThemeProvider

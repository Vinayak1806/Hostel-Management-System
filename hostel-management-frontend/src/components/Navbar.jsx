import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export const Navbar = ({ title }) => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container flex items-center justify-between h-16">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar

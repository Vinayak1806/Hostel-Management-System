export const Navbar = ({ title }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container flex items-center justify-between h-16">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>
    </nav>
  )
}

export default Navbar

import fs from 'fs'
import path from 'path'

const pagesDir = 'd:/Programs/Web Development Project/project/frontend/src/pages'

function checkFiles(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      checkFiles(fullPath)
    } else if (fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8')
      const lines = content.split('\n')
      lines.forEach((line, index) => {
        if (line.includes('<button') || line.includes('<Button')) {
          if (!line.includes('onClick') && !line.includes('type="submit"')) {
            // Check if it has a wrapping Link or is part of a multi-line tag
            console.log(`File: ${file}, Line: ${index + 1}: ${line.trim()}`)
          }
        }
      })
    }
  }
}

checkFiles(pagesDir)

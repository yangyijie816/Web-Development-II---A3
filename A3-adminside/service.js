const http = require('http')
const fs = require('fs')
const path = require('path')

let contentTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
}

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'fundraiser.html' : req.url)
  let extname = path.extname(filePath)

  let contentType = contentTypes[extname] || 'text/html'

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == 'ENOENT') {
        fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' })
          res.end(content, 'utf-8')
        })
      } else {
        res.writeHead(500)
        res.end(`Server Error: ${error.code}`)
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content, 'utf-8')
    }
  })
})

const PORT = 8081
server.listen(PORT, () => {
  console.log(`Starting success http://localhost:${PORT}`)
})

const express = require('express')
const path = require('path')
const app = express()
app.use(express.static(path.join(__dirname)))
const PORT = 8081
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

const mysql = require('mysql2')
const express = require('express')
const cors = require('cors')
const app = express()
// Default port number
const port = 3000

app.use(express.json())
// Cross-domain prevention
app.use(cors())

// Configuring database parameters
const connection = mysql.createConnection({
  host: 'localhost', // Database ip
  user: 'root', // Database user name
  password: '777486YYY', // Database password  
  database: 'crowdfunding_db', // Database Name
})

// Linked database
connection.connect(err => {
  if (err) {
    console.log('数据库连接失败: ' + err.stack)
    return
  }
  console.log('数据库连接成功！')
})

// Get a list of fundraisers
app.get('/fundraisers', (req, res) => {
  const query = `
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION,f.ACTIVE, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, c.NAME AS CATEGORY_NAME
        FROM FUNDRAISER f
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.ACTIVE = 1
    `
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(results)
  })
})

// Get a list of fundraisers according to the conditions:organizer, city, catagoryId
app.get('/search', (req, res) => {
  const params = []
  const organizerCondition = req.query.organizer ? `f.ORGANIZER = ?` : ''
  const cityCondition = req.query.city ? `f.CITY = ?` : ''
  const categoryCondition = req.query.categoryId ? `f.CATEGORY_ID = ?` : ''
  // Filter out parameters that are not passed in
  const conditions = [organizerCondition, cityCondition, categoryCondition].filter(Boolean)
  const query = `
  SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.ACTIVE, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, c.NAME AS CATEGORY_NAME
  FROM FUNDRAISER f
  JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
  ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
  `.trim()

  // Add the corresponding parameters
  if (req.query.organizer) params.push(req.query.organizer)
  if (req.query.city) params.push(req.query.city)
  if (req.query.categoryId) params.push(req.query.categoryId)

  connection.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(results)
  })
})

// Get all categories
app.get('/categories', (req, res) => {
  connection.query('SELECT * FROM CATEGORY', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(results)
  })
})

// Get the details based on the ID
app.get('/fundraiser/:id', (req, res) => {
  const fundraiserId = req.params.id
  const query = `
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, c.NAME AS CATEGORY_NAME
        FROM FUNDRAISER f
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.FUNDRAISER_ID = ?
    `
  connection.query(query, [fundraiserId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (results.length === 0) {
      return res.status(404).json({ message: '404' })
    }
    res.json(results[0])
  })
})

// Database startup
app.listen(port, () => {
  console.log('启动成功：' + `http://localhost:${port}`)
})

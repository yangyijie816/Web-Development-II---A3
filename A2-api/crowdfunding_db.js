const mysql = require('mysql2')
const express = require('express')
const cors = require('cors')
const app = express()
// 默认端口号
const port = 3000

app.use(express.json())
app.use(cors())

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'crowdfunding_db',
})

connection.connect(err => {
  if (err) {
    console.log('数据库连接失败: ' + err.stack)
    return
  }
  console.log('数据库连接成功！')
})

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
app.get('/search', (req, res) => {
  const params = []
  const organizerCondition = req.query.organizer ? `f.ORGANIZER = ?` : ''
  const cityCondition = req.query.city ? `f.CITY = ?` : ''
  const categoryCondition = req.query.categoryId ? `f.CATEGORY_ID = ?` : ''
  //
  const conditions = [organizerCondition, cityCondition, categoryCondition].filter(Boolean)
  const query = `
  SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.ACTIVE, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, c.NAME AS CATEGORY_NAME
  FROM FUNDRAISER f
  JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
  ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
  `.trim()

  // 添加对应的参数
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

app.get('/categories', (req, res) => {
  connection.query('SELECT * FROM CATEGORY', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(results)
  })
})
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

app.listen(port, () => {
  console.log('启动成功：' + `http://localhost:${port}`)
})

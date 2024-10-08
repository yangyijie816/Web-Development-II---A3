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
  password: '123456', //'777486YYY', // Database password
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
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.DESCRIPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY,f.CATEGORY_ID, c.NAME AS CATEGORY_NAME
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

// 创建PUT方法，根据给定的ID更新现有的筹款人。
app.put('/fundraiser/:id', async (req, res) => {
  const fundraiserId = req.params.id
  if (fundraiserId === undefined || fundraiserId === null) return res.status(400).json({ message: 'lack id parameter' })
  const { ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID, DESCRIPTION } = req.body
  const updates = ['ORGANIZER = ?', 'CAPTION = ?', 'TARGET_FUNDING = ?', 'CURRENT_FUNDING = ?', 'CITY = ?', 'ACTIVE = ?', 'CATEGORY_ID = ?', 'DESCRIPTION = ?']
  const values = [ORGANIZER, CAPTION, Number(TARGET_FUNDING), Number(CURRENT_FUNDING), CITY, Number(ACTIVE), Number(CATEGORY_ID), DESCRIPTION]
  if (updates.length === 0) {
    return res.status(400).json({ message: 'No update field is provided' })
  }
  const query = `
      UPDATE FUNDRAISER
      SET ${updates.join(', ')}
      WHERE FUNDRAISER_ID = ?
  `
  values.push(Number(fundraiserId))
  connection.execute(query, values, err => {
    if (!err) {
      res.status(200).json({ message: '筹款者信息更新成功' })
    } else {
      res.status(500).json({ message: err.message })
    }
  })
})

// 添加新的捐赠信息
app.post('/donation', (req, res) => {
  const { date, amount, giver, fundraiserId } = req.body
  const query = 'INSERT INTO DONATION (DATE, AMOUNT, GIVER, FUNDRAISER_ID) VALUES (?, ?, ?, ?)'
  connection.query(query, [date, amount, giver, fundraiserId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(201).json({ message: '添加成功', donationId: results.insertId })
  })
})

// 创建POST方法将新的筹款人插入数据库。
app.post('/fundraiser', (req, res) => {
  const { ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID, DESCRIPTION } = req.body
  if (ORGANIZER === null) return res.status(400).json({ message: 'lack ORGANIZER parameter' })
  if (CAPTION === null) return res.status(400).json({ message: 'lack CAPTION parameter' })
  if (TARGET_FUNDING === null) return res.status(400).json({ message: 'lack TARGET_FUNDING parameter' })
  if (CURRENT_FUNDING === null) return res.status(400).json({ message: 'lack CURRENT_FUNDING parameter' })
  if (CITY === null) return res.status(400).json({ message: 'lack CITY parameter' })
  if (ACTIVE === null) return res.status(400).json({ message: 'lack ACTIVE parameter' })
  if (CATEGORY_ID === null) return res.status(400).json({ message: 'lack CATEGORY_ID parameter' })
  if (Number(TARGET_FUNDING) < 1) return res.status(400).json({ message: "TARGET_FUNDING Can't be less than 1" })
  if (Number(CURRENT_FUNDING) < 0) return res.status(400).json({ message: "CURRENT_FUNDING Can't be less than 0" })
  const query =
    'INSERT INTO FUNDRAISER (ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID, DESCRIPTION) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  connection.query(query, [ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID, DESCRIPTION], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(200).json({ message: 'New success', fundraiserId: results.insertId })
  })
})

//创建DELETE方法删除基于给定ID的现有筹款人。只有尚未收到捐款的筹款人才能被删除。否则，就违背了数据完整性的概念。
app.delete('/fundraiser/:id', (req, res) => {
  const fundraiserId = req.params.id
  const checkQuery = 'SELECT COUNT(*) AS donations FROM DONATION WHERE FUNDRAISER_ID = ?'
  connection.query(checkQuery, [fundraiserId], (err, results) => {
    console.log(results)
    if (err) return res.status(500).json({ error: err.message })
    if (results[0].donations > 0) {
      return res.status(400).json({ message: 'You cannot delete fundraiser with donations' })
    }
    const deleteQuery = 'DELETE FROM FUNDRAISER WHERE FUNDRAISER_ID = ?'
    connection.query(deleteQuery, [fundraiserId], err => {
      if (err) return res.status(500).json({ error: err.message })
      res.status(200).json({ message: 'successfully delete' })
    })
  })
})

// Database startup
app.listen(port, () => {
  console.log('启动成功：' + `http://localhost:${port}`)
})

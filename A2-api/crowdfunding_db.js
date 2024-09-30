const mysql = require('mysql2')
const express = require('express')
const app = express()
// 默认端口号
const port = 3000

app.use(express.json())

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

// 1. 获取所有活动的筹款项目及其类别
app.get('/fundraisers', (req, res) => {
  const query = `
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, c.NAME AS CATEGORY_NAME
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

app.listen(port, () => {
  console.log('启动成功：' + `http://localhost:${port}`)
})

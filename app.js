const express = require('express')
const app = express()
const path = require('path')
const port = 3000

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (reg, res) => {
  res.render('pages/home')
})

app.get('/about', (reg, res) => {
  res.render('pages/about')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

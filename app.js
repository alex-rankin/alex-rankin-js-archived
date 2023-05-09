// Establish keys
require('dotenv').config()

const path = require('path')
const fetch = require ('node-fetch')
const express = require('express')
const { fileURLToPath } = require('url')
const prismic = require('@prismicio/client')
const prismicH = require('@prismicio/helpers')
const errorHandler = require('errorhandler')
const UAParser = require('ua-parser-js')

const app = express()
const port = process.env.PORT || 3000 // When going live add in a port in .env but for now its an or

app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))

// Set PUG as template engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.locals.basedir = app.get('views')

// Initialize the prismic.io api
const initApi = (req) => {
  return prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch
  })
}

// Link Resolver (routing for pages to dir)
const HandleLinkResolver = (doc) => {
  // About page
  if (doc.type === 'about') {
    return '/about'
  }

  // Default to homepage
  return '/'
}

// Add a middleware function that runs on every route. It will inject
// the prismic context to the locals so that we can access these in
// our templates.
app.use((req, res, next) => {
  const ua = UAParser(req.headers['user-agent'])

  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'

  res.locals.Link = HandleLinkResolver
  res.locals.prismicH = prismicH
  res.locals.Numbers = (index) => {
    return index === 0
      ? 'One'
      : index === 1
        ? 'Two'
        : index === 2
          ? 'Three'
          : index === 3
            ? 'Four'
            : ''
  }
  next()
})

// Api fetch to get each single page used
const handleRequest = async (api) => {
  const [meta, icons, home, about] =
    await Promise.all([
      api.getSingle('meta'),
      api.getSingle('icons'),
      api.getSingle('home'),
      api.getSingle('about')
      // api.query(Prismic.Predicates.at('document.type', 'collection'), {
      //   fetchLinks: 'product.image'
      // })
    ])

  const assets = []

  // home.data.gallery.forEach((item) => {
  //   assets.push(item.media.url)
  // })

  console.log(assets)

  return {
    assets,
    meta,
    icons,
    home,
    about
  }
}

// Query for the root path
app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  res.render('pages/home', { ...defaults })
})

// Query for the about path
app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  res.render('pages/about', { ...defaults })
})

// Listen to application port and log it
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

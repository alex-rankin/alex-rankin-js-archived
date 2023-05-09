import each from 'lodash/each'

import Menu from 'classes/Menu'

import About from 'pages/About'
import Home from 'pages/Home'

class App {
  constructor () {
    this.createContent()
    this.createPages()
    this.createMenu()

    this.addLinkListeners()
  }

  createContent () {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createPages () {
    this.pages = {
      about: new About(),
      home: new Home()
    }
    this.page = this.pages[this.template]
    this.page.create()
    this.page.show()
  }

  createMenu () {
    this.menu = new Menu()
    // Call the `create` method of the Menu class to create the liquid menu
    this.menu.create()
  }

  // Page content transitions instead of loading each time
  async onChange (url) {
    await this.page.hide()

    const request = await window.fetch(url)

    if (request.status === 200) {
      const html = await request.text()
      const div = document.createElement('div')

      div.innerHTML = html

      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')

      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.page = this.pages[this.template]
      this.page.create()
      this.page.show()
    } else {
      console.log('Error')
    }
  }

  addLinkListeners () {
    const links = document.querySelectorAll('a')

    each(links, link => {
      link.onclick = event => {
        event.preventDefault()

        const { href } = link
        this.onChange(href)
      }
    })
  }
}

// eslint-disable-next-line no-new
new App()

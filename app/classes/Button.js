import GSAP from 'gsap'

import Component from 'classes/Component'

export default class Button extends Component {
  constructor ({ element }) {
    super({ element })

    document.querySelectorAll('.button__wrapper > a').forEach(button => {
      const div = document.createElement('div')
      const letters = button.textContent.trim().split('')

      function elements (letter, index, array) {
        const element = document.createElement('span')
        const part = (index >= array.length / 2) ? -1 : 1
        const position = (index >= array.length / 2) ? array.length / 2 - index + (array.length / 2 - 1) : index
        const move = position / (array.length / 2)
        const rotate = 1 - move

        element.innerHTML = !letter.trim() ? '&nbsp;' : letter
        element.style.setProperty('--move', move)
        element.style.setProperty('--rotate', rotate)
        element.style.setProperty('--part', part)

        div.appendChild(element)
      }

      letters.forEach(elements)

      button.innerHTML = div.outerHTML

      button.addEventListener('mouseenter', e => {
        if (!button.classList.contains('out')) {
          button.classList.add('in')
        }
      })

      button.addEventListener('mouseleave', e => {
        if (button.classList.contains('in')) {
          button.classList.add('out')
          setTimeout(() => button.classList.remove('in', 'out'), 950)
        }
      })
    })
  }
}

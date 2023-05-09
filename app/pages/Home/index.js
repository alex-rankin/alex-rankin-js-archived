import gsap from 'gsap'

import Page from 'classes/Page'
import Button from 'classes/Button'

export default class Home extends Page {
  constructor () {
    super({
      id: 'home',
      element: '.home',
      elements: {
        link: '.contact__button'
      }
    })
  }

  create () {
    super.create()

    this.link = new Button({
      element: this.elements.link
    })

    // START GSAP projects scroller
    gsap.registerPlugin(ScrollTrigger)

    ScrollTrigger.saveStyles([
      '.project__reveal__item .c-fluid-reveal__wobble',
      '.project__reveal__item .project__item-media',
      '.project__reveal__item .project-title__content'
    ])

    // get elements, nodelist to array
    const fluidRevealEls = gsap.utils.toArray('.project__reveal__item')

    // set variable for wrapper height using css calc
    const wrapper = document.querySelector('.projects__wrapper')
    wrapper.style.setProperty('--items', fluidRevealEls.length)

    const animateDuration = 2
    const pinDuration = 5

    let wobble
    let content
    let media
    let tl

    ScrollTrigger.matchMedia({
      // desktop
      '(min-width: 800px)': function () {
        console.log('Desktop')

        tl = gsap.timeline({
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            pin: true,
            pinSpacing: false,
            end: 'bottom bottom',
            scrub: 0.4,
            markers: true,
            onLeaveBack: () => {
              gsap.set(wrapper, { maxHeight: 'none', height: 'auto' })
            }
          }
        })

        let count = 1

        // Fluid effects
        fluidRevealEls.forEach((el) => {
          wobble = el.querySelector('path')
          media = el.querySelector('.project__item-media')
          content = el.querySelector('.project-title__content')

          if (count > 1) {
            tl.from(wobble, {
              duration: animateDuration,
              xPercent: 100,
              yPercent: 100
            }, '-=' + animateDuration)
          } else {
            tl.from(wobble, {
              duration: animateDuration,
              xPercent: 100,
              yPercent: 100
            })
          }

          tl.from(content, {
            duration: animateDuration,
            opacity: 0,
            yPercent: 100
          }, '-=' + animateDuration)
            .to(el, {
              duration: pinDuration
            })

          if (count < fluidRevealEls.length) {
            tl.to(content,
              {
                duration: animateDuration,
                opacity: 0,
                yPercent: -100
              }, '-=' + animateDuration
            )
          }
          count++
        })
      },

      // mobile
      '(max-width: 800px)': function () {
        if (tl) {
          tl.kill()
        }
        console.log('Mobile')
      }
    })
  }
}

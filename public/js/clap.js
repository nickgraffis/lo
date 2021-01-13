const lo = require('./api/lojax.js')
let claps = 0

class Clap {
  constructor (id) {
    this.id = id,
    this.claps = 0
  }

  async clap (event) {
    this.claps++
    if (!event.target.classList.contains('clap')) {
      return false
    }
    const clap = event.target
    const wrapper = event.target.parentElement
    const count = wrapper.querySelector('.count')
    let clapCount = parseInt(count.innerHTML)
    if (!clapCount) {
      clapCount = 0
    }
    let currentCount = await lo.update('post', {id: this.id, claps: (clapCount + 1)})
    const confetti = wrapper.querySelector('.confetti')
    const plus = wrapper.querySelector('.plus')
    const bits = confetti.querySelectorAll('.bit')
    clap.classList.add('text-gray-800')
    clap.style = '-webkit-transform: scale3d(1.1,1.1,1.1)'
    confetti.classList.replace('hidden', 'visible')
    bits.forEach((bit) => {
      bit.classList.replace('opacity-0', 'opacity-100')
    })
    setTimeout(() => {
      confetti.classList.replace('scale-50', 'scale-110')
    }, 50)
    plus.classList.replace('opacity-0', 'opacity-100')
    plus.classList.replace('translate-y-0', '-translate-y-2')
    plus.innerHTML = '+' + this.claps
    count.classList.add('-translate-y-2', 'opacity-0')
    setTimeout(() => {
      clap.classList.remove('text-gray-800')
      clap.style = '-webkit-transform: scale3d(1,1,1)'
      confetti.classList.replace('visible', 'hidden')
      bits.forEach((bit) => {
        bit.classList.replace('opacity-100', 'opacity-0')
      })
      plus.classList.replace('-translate-y-2', 'translate-y-0')
      plus.classList.replace('opacity-100', 'opacity-0')
      count.innerHTML = JSON.parse(currentCount).claps
      if (JSON.parse(currentCount).claps == 1) {
        count.innerHTML = '1'
        count.parentElement.innerHTML += ' claps'
      }
      count.classList.remove('-translate-y-2', 'opacity-0')
      setTimeout(() => {
        confetti.classList.replace('scale-110', 'scale-50')
      }, 150)
    }, 300)
  }
}

module.exports = {
  start: (id) => new Clap(id)
}

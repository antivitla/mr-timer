import store from '@/store'
import Entry from '@/models/entry'
import { getters } from '@/store/timer'

// function start () {
//   return getters.start(store.state.timer)
// }

// function stop () {
//   return getters.stop(store.state.timer)
// }

function duration () {
  return getters.timerDuration(store.state.timer)
}

function isActive () {
  return getters.timerActive(store.state.timer)
}

function delay () {
  return getters.timerDelay(store.state.timer)
}

describe('Timer', () => {
  it('can be toggled and works', (done) => {
    store.dispatch('startTimer', {
      entry: new Entry({
        start: (new Date()).getTime()
      })
    })
    setTimeout(() => {
      expect(isActive()).to.be.true
      expect(duration() >= delay()).to.be.true
      store.dispatch('stopTimer')
      expect(!isActive()).to.be.true
      done()
    }, delay() + 1)
  })
})

import Entry from '@/models/entry'
import { Tasks } from '@/store/groups/tasks'
import store from '@/store'

describe('Tasks', () => {
  beforeEach(() => {
    store.commit('clearEntries')
  })

  it('exists', () => {
    expect(Tasks).to.be.ok
  })

  it('grows upon adding entry', () => {
    const l = Tasks.children.length
    store.commit('addEntry', { entry: new Entry() })
    expect(Tasks.children.length).to.equal(l + 1)
  })

  it('has duration', () => {
    const start = new Date()
    start.setYear(1980)
    store.commit('addEntry', {
      entry: new Entry({
        start
      })
    })
    expect(Tasks.children[0].duration() > 0).to.be.true
  })

  it('has name', () => {
    const start = new Date()
    start.setYear(1980)
    store.commit('addEntry', {
      entry: new Entry({
        details: ['Vitla']
      })
    })
    expect(Tasks.children[0].name).to.equal('Vitla')
  })
})

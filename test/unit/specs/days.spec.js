import Entry from '@/models/entry'
import { Days } from '@/store/groups/days'
import store from '@/store'

describe('Days', () => {
  beforeEach(() => {
    store.commit('clearEntries')
  })

  it('exists', () => {
    expect(Days).to.be.ok
  })

  it('grows upon adding entry', () => {
    const l = Days.children.length
    store.commit('addEntry', { entry: new Entry() })
    expect(Days.children.length).to.equal(l + 1)
  })
})

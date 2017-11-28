import Entry from '@/models/entry'
import { Months } from '@/store/groups/months'
import store from '@/store'

describe('Months', () => {
  beforeEach(() => {
    store.commit('clearEntries')
  })

  it('exists', () => {
    expect(Months).to.be.ok
  })

  it('grows upon adding entry', () => {
    const l = Months.children.length
    store.commit('addEntry', { entry: new Entry() })
    expect(Months.children.length).to.equal(l + 1)
  })
})

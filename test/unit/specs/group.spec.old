/* global check, gen */
require('mocha-testcheck').install()
import Chance from 'chance'
import Group from '@/models/group'
import Entry from '@/models/entry'

const chance = new Chance()

function randomNames (count) {
  const chance = new Chance()
  const names = []
  for (let i = 0; i < count; i += 1) {
    names.push(`${chance.word()} ${chance.word()}`)
  }
  return names
}

function randomEntries (countEntries, countNames) {
  const names = randomNames(countNames)
  const entries = []
  for (let i = 0; i < countEntries; i += 1) {
    const id = chance.integer({
      min: 0,
      max: names.length - 1
    })
    const name = names[id]
    const start = chance.date({
      year: chance.integer({min: 1900, max: 2000})
    }).getTime()
    const stop = chance.date({
      year: chance.integer({min: 2001, max: 2200})
    }).getTime()
    entries.push(new Entry({
      details: [name],
      start,
      stop
    }))
  }
  return entries
}

describe('Group', () => {
  it('exists', () => {
    const group = new Group()
    expect(group).to.be.ok
  })

  check.it('has name',
    {times: 20},
    gen.object({name: gen.primitive.nullable()}),
    () => {
      const group = new Group()
      expect(group.name).to.be.ok
    })

  describe('test flat pack', () => {
    let entries
    let group

    beforeEach(() => {
      entries = randomEntries(50, 10)
      group = new Group({
        pathFn: entry => entry.details.slice(0)
      })
      group.batch('addEntry', entries)
    })

    it('has entries', () => {
      expect(group.children.length > 0).to.be.true
    })

    it('is ordered', () => {
      const late = chance.natural({
        min: 0,
        max: group.children.length - 2
      })
      const early = chance.natural({
        min: late + 1,
        max: group.children.length - 1
      })
      const lateChild = group.children[late].lastUpdated()
      const earlyChild = group.children[early].lastUpdated()
      expect(lateChild > earlyChild).to.be.true
    })

    it('has duration', () => {
      expect(group.duration() > 0).to.be.true
    })

    it('has path && iud', () => {
      expect(group.path().length > 0).to.be.true
      expect(group.path()[0]).to.equal(group.name)
      expect(group.uid()).to.equal(group.name)
    })
  })
})

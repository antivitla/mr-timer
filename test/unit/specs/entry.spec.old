import moment from 'moment'
import Entry from '@/models/entry'

describe('Entry', () => {
  it('can be created', () => {
    const entry = new Entry()
    expect(entry).to.be.ok
  })

  it('has details even if no details provided', () => {
    const entry = new Entry()
    expect(entry.details.length > 0).to.be.true
  })

  it('keep start and stop', () => {
    const start = new Date().getTime()
    const stop = new Date().getTime()
    const entry = new Entry({start, stop})
    expect(entry.start).to.equal(start)
    expect(entry.stop).to.equal(stop)
  })

  it('keeps predictable long details', () => {
    const details = ['1', '2', null, '3']
    const entry = new Entry({details})
    expect(entry.details.join('')).to.equal('123')
  })

  it('calc duration', () => {
    const start = moment()
    const stop = moment()
    start.hour(1).minute(0)
    stop.hour(2).minute(1)
    const entry = new Entry({start: start.valueOf(), stop: stop.valueOf()})
    expect(entry.duration() > 1000 * 60 * 60).to.be.true
  })
})

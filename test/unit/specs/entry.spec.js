/* global gen, check */
require('mocha-testcheck').install()
import moment from 'moment'
import Entry from '@/models/entry'

function isArrayOfStrings (array) {
  return array.every(item => typeof item === 'string')
}

function noFalsyItems (array) {
  return array.every(item => item)
}

// beforeEach(done => {
//   setTimeout(() => {
//     done()
//   }, 5)
// })

// afterEach(done => {
//   setTimeout(() => {
//     done()
//   }, 5)
// })

describe('Entry', () => {
  // beforeEach(() => {
  //   jasmine.clock().install()
  // })

  // afterEach(() => {
  //   jasmine.clock().uninstall()
  // })

  it('can be created', () => {
    const entry = new Entry()
    expect(entry).to.be.ok
  })

  it('has details even if no details provided', () => {
    const entry = new Entry()
    expect(entry.details.length > 0).to.be.true
  })

  check.it('has details if gremlin args',
    {times: 20, maxSize: 10},
    gen.any,
    gremlin => {
      const entry = new Entry(gremlin)
      expect(Array.isArray(entry.details)).to.be.true
      entry.details.forEach(detail => {
        expect(typeof detail).to.equal('string')
      })
    })

  check.it('has details and start/stop if gremlin object given',
    {times: 20, maxSize: 10},
    gen.object(gen.any, {maxSize: 3}),
    gremlin => {
      const entry = new Entry(gremlin)
      expect(moment(entry.start).isValid()).to.be.true
      expect(moment(entry.stop).isValid()).to.be.true
      expect(Array.isArray(entry.details)).to.be.true
      expect(isArrayOfStrings(entry.details)).to.be.true
    })

  check.it('gremlin {start, stop} any',
    {times: 10, maxSize: 10},
    gen.object({start: gen.any, stop: gen.any}),
    gremlin => {
      const entry = new Entry(gremlin)
      expect(moment(entry.start).isValid()).to.be.true
      expect(moment(entry.stop).isValid()).to.be.true
    })

  check.it('gremlin {start, stop} primitive',
    {times: 10, maxSize: 10},
    gen.object({start: gen.primitive.nullable, stop: gen.primitive.nullable}),
    gremlin => {
      const entry = new Entry(gremlin)
      expect(moment(entry.start).isValid()).to.be.true
      expect(moment(entry.stop).isValid()).to.be.true
    })

  check.it('gremlin check {details} array of any',
    {times: 20, maxSize: 10},
    gen.object({details: gen.array(gen.any.nullable())}),
    gremlin => {
      const entry = new Entry(gremlin)
      expect(noFalsyItems(entry.details)).to.be.true
      expect(isArrayOfStrings(entry.details)).to.be.true
    })

  check.it('gremlin check {details} array of primitive',
    {times: 20, maxSize: 10},
    gen.object({details: gen.array(gen.primitive.nullable())}),
    gremlin => {
      const entry = new Entry(gremlin)
      expect(noFalsyItems(entry.details)).to.be.true
      expect(isArrayOfStrings(entry.details)).to.be.true
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

  check.it('can parse ms dates',
    {times: 5, size: 20},
    gen.object({
      start: gen.intWithin(Math.pow(10, 14), Math.pow(10, 15)),
      stop: gen.intWithin(Math.pow(10, 14), Math.pow(10, 15))
    }),
    time => {
      const start = moment(time.start)
      const entry = new Entry(time)
      expect(entry.start).to.equal(start.valueOf())
    })

  check.it('can parse formatted dates',
    {times: 10, size: 20},
    gen.object({
      start: gen.intWithin(100, Math.pow(10, 14) * 2),
      stop: gen.intWithin(100, Math.pow(10, 14) * 2)
    }),
    time => {
      const start = moment(time.start).toISOString()
      const stop = moment(time.stop).format('YYYY.MM.DD')
      const entry = new Entry({start, stop})
      expect(start).to.equal(moment(entry.start).toISOString())
      expect(stop).to.equal(moment(entry.stop).format('YYYY.MM.DD'))
    })
})

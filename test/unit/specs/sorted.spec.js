import Chance from 'chance'
import { closestSorted, insertSorted } from '@/utils/sorted'

const chance = new Chance()

function uniqueNatural (min, max) {
  const last = []
  return () => {
    let n = min
    while (last.indexOf(n) > -1) {
      n = chance.natural({min, max})
    }
    last.push(n)
    return n
  }
}

describe('Sorted', () => {
  describe('closest', () => {
    it('find closest in asc', () => {
      const array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
      const closest = closestSorted({child: 4, children: array})
      expect(closest).to.equal(3)
    })

    it('find closest in dsc', () => {
      const array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19].reverse()
      const closest = closestSorted({child: 4, children: array})
      expect(closest).to.equal(5)
    })

    it('find closest in same asc', () => {
      const array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19].reverse()
      const closest = closestSorted({child: 11, children: array})
      expect(closest).to.equal(11)
    })

    it('find closest in same dsc', () => {
      const array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19].reverse()
      const closest = closestSorted({child: 3, children: array})
      expect(closest).to.equal(3)
    })
  })

  describe('insert', () => {
    it('insert right in asc', () => {
      const array = [1, 3, 5, 7]
      insertSorted({
        child: 4,
        children: array
      })
      expect(array.join('')).to.equal('13457')
    })

    it('insert right', () => {
      const array = []
      const next = uniqueNatural(1, 10)
      for (let i = 0; i < 10; i += 1) {
        insertSorted({
          child: next(),
          children: array,
          dir: 1
        })
      }
      expect(array.join(',')).to.equal('10,9,8,7,6,5,4,3,2,1')
      array.reverse()
      insertSorted({
        child: 4.5,
        children: array
      })
      expect(array.join(',')).to.equal('1,2,3,4,4.5,5,6,7,8,9,10')
    })
  })
})

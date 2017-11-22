import moment from 'moment'
import { mapGetters } from 'vuex'
import { currencies } from '@/store/i18n'
import { durationHuman } from '@/utils/duration'
import capitalize from '@/utils/capitalize'
import i18nLabel from '@/mixins/i18n-label'

const urlRegexp = /((https?):\/\/.*?(\s|$))/

export default {
  data () {
    return {
      reportLabels: {
        hr: '',
        min: '',
        sec: ''
      },
      reportTab: '  ',
      reportMaxDepth: null,
      reportShowDuration: false,
      reportShowPrice: true
    }
  },
  created () {
    const l = this.label('duration', false)
    this.reportLabels.hr = l.hr
    this.reportLabels.min = l.min
    this.reportLabels.sec = l.sec
  },
  computed: {
    ...mapGetters([
      'price',
      'isCurrencySymbolBefore',
      'currency'
    ])
  },
  methods: {
    generateReport ({ children = [], depth = 0, rootType } = {}) {
      let result = []
      // let l = this.reportLabels
      children.forEach(child => {
        if (child.type === 'task') {
          result = result.concat(this.reportTaskLines({
            child,
            depth
          }))
        } else if (child.type === 'day') {
          result = result.concat(this.reportDayLine({
            child,
            depth
          }))
        } else if (child.type === 'month') {
          result = result.concat(this.reportMonthLine({
            child,
            depth
          }))
        }
        if (child.children && child.children.length > 0 && child.children[0].type) {
          result = result.concat(this.generateReport({
            children: child.children,
            depth: child.type !== 'task' ? depth : depth + 1
          }))
          if (result.slice(-1)[0]) {
            result.push('')
          }
        }
      })
      return result
    },
    reportMonthLine ({ child }) {
      let line = capitalize(moment(child.lastUpdated()).format('MMMM'))
      const ms = child.duration()
      const l = this.reportLabels
      if (ms > 1000) {
        line = line + ': ' + durationHuman(ms, l.hr, l.min, l.sec)
      }
      if (this.price) {
        line = line + ' = ' + this.reportCost(ms)
      }
      return ['', line, '-'.repeat(line.length), '']
    },
    reportDayLine ({ child }) {
      const name = moment(child.name).format('LL').replace(' г.', '')
      let line = name
      const ms = child.duration()
      const l = this.reportLabels
      if (ms > 1000) {
        line = line + ': ' + durationHuman(ms, l.hr, l.min, l.sec)
      }
      if (this.price) {
        line = line + ' = ' + this.reportCost(ms)
      }
      return ['', line, '-'.repeat(line.length), '']
    },
    reportTaskLines ({ child, depth = 0 } = {}) {
      const l = this.reportLabels
      let name = child.name
      if (name.match(urlRegexp)) {
        name = decodeURIComponent(name.replace(/https?:\/\//, ''))
      }
      if (depth === 0) {
        name = `${name}`
      }
      let line = name
      const isLeaf = !(child.children[0].type)
      const isLastDepth = this.reportMaxDepth && depth >= this.reportMaxDepth
      if ((!isLeaf && !isLastDepth) || depth === 0) {
        const ms = child.duration()
        if (ms > 1000) {
          line = line + ': ' + durationHuman(ms, l.hr, l.min, l.sec)
        }
        if (this.price) {
          line = line + ' = ' + this.reportCost(ms)
        }
      }
      if (depth === 0) {
        return [`${line}`]
      } else {
        return [`${this.reportTab.repeat(depth)}- ${line}`]
      }
    },
    reportCost (ms) {
      const c = parseInt(ms * this.price / 3600000, 10)
      let part = '' + c
      let result = ''
      while (part.length) {
        result = ' ' + part.substr(-3) + result
        part = part.slice(0, -3)
      }
      return this.addCurrency(result.trim())
    },
    addCurrency (price) {
      const symbol = currencies[this.currency].symbol
      if (this.isCurrencySymbolBefore) {
        return symbol + ' ' + price
      } else {
        return price + ' ' + symbol
      }
    },
    isLastDepth (depth) {
      return this.reportMaxDepth && depth >= this.reportMaxDepth
    },
    taskDepth (depth, rootType) {
      if (rootType !== 'task') {
        return depth - 1
      }
      return depth
    }
  },
  mixins: [
    i18nLabel
  ]
}

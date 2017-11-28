import moment from 'moment'
import { mapGetters } from 'vuex'
// import { currencies } from '@/store/i18n'
import { taskDelimiter } from '@/store/ui'
import { Storage } from '@/store/storage'
import { duration, durationHuman } from '@/utils/duration'
import i18nLabel from '@/mixins/i18n-label'
import Report from '@/report'

const urlRegexp = /((https?):\/\/.*?(\s|$))/

function isNest (item) {
  return item.type.match(/nest/)
}

export default {
  computed: {
    ...mapGetters([
      'isCurrencySymbolBefore',
      'price',
      'currency',
      'userName',
      'currentView'
    ])
  },
  methods: {

    //
    // Text Report
    //

    generateTextSummary (data) {
      let lines = []
      data.forEach(item => {
        if (item.type.match(/day/)) {
          lines = lines.concat(this.generateTextDayLines(item))
        } else if (item.type.match(/task/)) {
          lines = lines.concat(this.generateTextTaskLines(item))
        }
      })
      return lines.join('\n').trim()
    },
    generateTextDayLines (item) {
      if (!isNest(item)) {
        return [this.generateTextDayLine(item, true)]
      } else {
        let nested = []
        item.children.map(child => {
          nested = nested.concat(this.generateTextTaskLines(child, 1))
        })
        return ['', this.generateTextDayLine(item)].concat(nested)
      }
    },
    generateTextDayLine (item, isShort = false) {
      const name = moment(item.value).format('DD MMMM YYYY')
      const d = duration(item.duration).format('HH:mm')
      const maxSpace = isShort ? 20 : 60
      const space = (name.length < maxSpace ? ' .'.repeat(parseInt((maxSpace - name.length) * 0.5, 10)) : ' .')
      const addon = (name.length % 2 === 1 ? ' ' : '')
      return [`${name}${addon}${space} ${d}`]
    },
    generateTextTaskLines (item, depth = 0) {
      if (!isNest(item)) {
        return [this.generateTextTaskLine(item, depth)]
      } else if (item.children) {
        let nested = []
        item.children.map(child => {
          nested = nested.concat(this.generateTextTaskLines(child, depth + 1))
        })
        return [this.generateTextTaskLine(item, depth)].concat(nested)
      }
    },
    generateTextTaskLine (item, depth = 0) {
      let name = item.value
      if (name.match(urlRegexp)) {
        name = decodeURIComponent(name.replace(/https?:\/\//, ''))
      }
      const d = duration(item.duration).format('HH:mm')
      if (depth) {
        const padding = '  '.repeat(depth)
        return `${padding}${name} (${d})`
      } else {
        const space = (name.length < 60 ? ' .'.repeat(parseInt(30 - name.length * 0.5, 10)) : ' .')
        const addon = (name.length % 2 === 1 ? ' ' : '')
        return `${name}${addon}${space} ${d}`
      }
    },

    //
    // Markdown Report
    //

    generateMarkdownReport (structure) {
      let lines = [].concat(this.generateMarkdownHeader())
      const subheader = {
        'daysTasks': this.label('report.headerDaysTasks'),
        'tasks': this.label('report.headerTasks'),
        'days': this.label('report.headerDays')
      }
      const detailedSubheader = {
        'dayTasks': this.label('report.headerDetailedDaysTasks'),
        'tasks': this.label('report.headerDetailedTasks')
      }
      structure.forEach(section => {
        if (section.type === 'summary') {
          // Subheader
          if (section.summary.nested) {
            lines = lines.concat(['', `## ${detailedSubheader[section.summary.type]}`, ''])
          } else {
            lines = lines.concat(['', `## ${subheader[section.summary.type]}`, ''])
          }

          // Table
          const data = Report.summary[section.summary.type]({
            depth: section.summary.depth,
            nest: section.summary.nest
          })
          lines = lines.concat(this.generateMarkdownSummary(data))
        }
      })
      const filename = `${this.userName}.${this.context.join(' - ')}.${this.generateMarkdownPeriod()}.report.md`
      return {
        filename: filename.replace('.undefined', ''),
        content: lines.join('\n')
      }
    },

    generateMarkdownHeader () {
      const context = this.context.join(taskDelimiter)
      const period = this.generateMarkdownPeriod()
      // const user = this.userName
      const l = this.label('duration', false)
      const total = durationHuman(Storage.entries.reduce((total, entry) => {
        return total + (new Date(entry.stop).getTime() - new Date(entry.start).getTime())
      }, 0), l.hr, l.min, l.sec)
      const title = this.label('report.reportOnFor').replace('%0', context)
      if (context) {
        return [
          `# ${title}${period ? ', ' + period : ''}`,
          '',
          `${this.label('report.total')}: ${total}`
        ]
      } else {
        return [
          `# ${title}${period ? ', ' + period : ''}: ${total}`,
          '',
          `${this.label('report.total')}: ${total}`
        ]
      }
    },

    generateMarkdownPeriod () {
      if (this.currentView !== 'tasks') {
        const from = moment(Storage.entries.slice(-1)[0].start)
        const to = moment(Storage.entries[0].start)
        if (this.locale === 'ru') {
          if (from.year() === to.year()) {
            if (from.month() === to.month()) {
              return `${from.format('D')}-${to.format('D MMMM YYYY')}`
            } else {
              return `${from.format('D MMMM')} - ${to.format('D MMMM YYYY')}`
            }
          } else {
            return `${from.format('LLL')} - ${to.format('LLL')}`
          }
        } else {
          if (from.year() === to.year()) {
            if (from.month() === to.month()) {
              return `${from.format('MMMM')} ${from.format('D')}-${to.format('D YYYY')}`
            } else {
              return `${from.format('MMMM D')} - ${to.format('MMMM D YYYY')}`
            }
          } else {
            return `${from.format('LLL')} - ${to.format('LLL')}`
          }
        }
      }
    },

    generateMarkdownSummary (data) {
      let lines = []
      data.forEach(item => {
        if (item.type.match(/day/)) {
          lines = lines.concat(this.generateMarkdownDayLines(item))
        } else if (item.type.match(/task/)) {
          lines = lines.concat(this.generateMarkdownTaskLines(item))
        }
      })
      return lines.join('\n').trim()
    },
    generateMarkdownDayLines (item) {
      if (!isNest(item)) {
        return [this.generateMarkdownDayLine(item, true)]
      } else {
        let nested = []
        item.children.map(child => {
          nested = nested.concat(this.generateMarkdownTaskLines(child, 1))
        })
        return ['', this.generateMarkdownDayLine(item)].concat(nested)
      }
    },
    generateMarkdownDayLine (item, isShort = false) {
      const name = `**${moment(item.value).format('DD MMMM YYYY')}**`
      const d = `**${duration(item.duration).format('HH:mm')}**`
      const maxSpace = isShort ? 26 : 60
      const space = (name.length < maxSpace ? ' .'.repeat(parseInt((maxSpace - name.length) * 0.5, 10)) : ' .')
      const addon = (name.length % 2 === 1 ? ' ' : '')
      return [`${name}${addon}${space} ${d}`]
    },
    generateMarkdownTaskLines (item, depth = 0) {
      if (!isNest(item)) {
        return [this.generateMarkdownTaskLine(item, depth)]
      } else if (item.children) {
        let nested = []
        item.children.map(child => {
          nested = nested.concat(this.generateMarkdownTaskLines(child, depth + 1))
        })
        return [this.generateMarkdownTaskLine(item, depth)].concat(nested)
      }
    },
    generateMarkdownTaskLine (item, depth = 0) {
      let name = item.value
      if (name.match(urlRegexp)) {
        name = decodeURIComponent(name.replace(/https?:\/\//, ''))
      }
      let d = duration(item.duration).format('HH:mm')
      if (depth) {
        const padding = '  '.repeat(depth)
        return `${padding}${name} (${d})`
      } else {
        d = `**${d}**`
        name = `**${name}**`
        const space = (name.length < 60 ? ' .'.repeat(parseInt(30 - name.length * 0.5, 10)) : ' .')
        const addon = (name.length % 2 === 1 ? ' ' : '')
        return `${name}${addon}${space} ${d}`
      }
    },

    //
    // Spreadsheet Report
    //

    generateSpreadsheetSummary () {
      console.log('spread sheet')
    }

    // generateReport (children, options) {
      // console.log(report.summary.days())
      // console.log(report.summary.tasks({ depth: 1, nest: 1 }))
      // const report = Report.summary.days()
      // const report = Report.summary.daysTasks({ depth: 2, nest: 1 })
      // const report = Report.summary.tasks({ depth: 1, nest: 1 })
      // return report
      // let result = []
      // // let l = this.reportLabels
      // children.forEach(child => {
      //   if (child.type === 'task') {
      //     result = result.concat(this.reportTaskLines({
      //       child,
      //       depth
      //     }))
      //   } else if (child.type === 'day') {
      //     result = result.concat(this.reportDayLine({
      //       child,
      //       depth
      //     }))
      //   } else if (child.type === 'month') {
      //     result = result.concat(this.reportMonthLine({
      //       child,
      //       depth
      //     }))
      //   }
      //   if (child.children && child.children.length > 0 && child.children[0].type) {
      //     result = result.concat(this.generateReport({
      //       children: child.children,
      //       depth: child.type !== 'task' ? depth : depth + 1
      //     }))
      //     if (result.slice(-1)[0]) {
      //       result.push('')
      //     }
      //   }
      // })
      // return result
    // }
    // reportMonthLine ({ child }) {
    //   let line = capitalize(moment(child.lastUpdated()).format('MMMM'))
    //   const ms = child.duration()
    //   const l = this.reportLabels
    //   if (ms > 1000) {
    //     line = line + ': ' + durationHuman(ms, l.hr, l.min, l.sec)
    //   }
    //   if (this.price) {
    //     line = line + ' = ' + this.reportCost(ms)
    //   }
    //   return ['', line, '-'.repeat(line.length), '']
    // },
    // reportDayLine ({ child }) {
    //   const name = moment(child.name).format('LL').replace(' г.', '')
    //   let line = name
    //   const ms = child.duration()
    //   const l = this.reportLabels
    //   if (ms > 1000) {
    //     line = line + '\n' + durationHuman(ms, l.hr, l.min, l.sec)
    //   }
    //   if (this.price) {
    //     line = line + ' = ' + this.reportCost(ms)
    //   }
    //   return ['', line, '']
    // },
    // reportTaskLines ({ child, depth = 0 } = {}) {
    //   const l = this.reportLabels
    //   let name = child.name
    //   if (name.match(urlRegexp)) {
    //     name = decodeURIComponent(name.replace(/https?:\/\//, ''))
    //   }
    //   if (depth === 0) {
    //     name = `${name}`
    //   }
    //   let line = name
    //   const isLeaf = !(child.children[0].type)
    //   const isLastDepth = this.reportMaxDepth && depth >= this.reportMaxDepth
    //   if ((!isLeaf && !isLastDepth) || depth === 0) {
    //     const ms = child.duration()
    //     if (ms > 1000) {
    //       const delim = depth ? ': ' : ' .'.repeat((60 - name.length - (depth + 1) * 2) * 0.5) + ' '
    //       line = line + delim + durationHuman(ms, l.hr, l.min, l.sec)
    //     }
    //     if (this.price) {
    //       line = line + ' = ' + this.reportCost(ms)
    //     }
    //   }
    //   if (depth === 0) {
    //     return [`${this.reportTab}${line}`]
    //   } else {
    //     return [`${this.reportTab.repeat(depth + 1)}- ${line}`]
    //   }
    // },
    // reportCost (ms) {
    //   const c = parseInt(ms * this.price / 3600000, 10)
    //   let part = '' + c
    //   let result = ''
    //   while (part.length) {
    //     result = ' ' + part.substr(-3) + result
    //     part = part.slice(0, -3)
    //   }
    //   return this.addCurrency(result.trim())
    // },
    // addCurrency (price) {
    //   const symbol = currencies[this.currency].symbol
    //   if (this.isCurrencySymbolBefore) {
    //     return symbol + ' ' + price
    //   } else {
    //     return price + ' ' + symbol
    //   }
    // },
    // isLastDepth (depth) {
    //   return this.reportMaxDepth && depth >= this.reportMaxDepth
    // },
    // taskDepth (depth, rootType) {
    //   if (rootType !== 'task') {
    //     return depth - 1
    //   }
    //   return depth
    // }
  },
  mixins: [
    i18nLabel
  ]
}

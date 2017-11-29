import moment from 'moment'
import slugify from 'slugify'
import { mapGetters } from 'vuex'
// import { currencies } from '@/store/i18n'
import { taskDelimiter } from '@/store/ui'
import { Storage } from '@/store/storage'
import { duration, durationHuman } from '@/utils/duration'
import i18nLabel from '@/mixins/i18n-label'
import Report from '@/report'

function getTotalTime () {
  return Storage.entries.reduce((total, entry) => {
    return total + (new Date(entry.stop).getTime() - new Date(entry.start).getTime())
  }, 0)
}

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

    generateTextReport (structure) {
      const subheader = {
        'daysTasks': this.label('report.headerDaysTasks'),
        'tasks': this.label('report.headerTasks'),
        'days': this.label('report.headerDays')
      }
      const detailedSubheader = {
        'daysTasks': this.label('report.headerDetailedDaysTasks'),
        'tasks': this.label('report.headerDetailedTasks')
      }
      let lines = []
      structure.forEach((section, index) => {
        if (section.type === 'text') {
          // Text
          lines = lines.concat([section.text])
        } else if (section.type === 'header') {
          // Header
          if (index) {
            lines = lines.concat(['', ''])
          }
          if (!section.header) {
            lines = lines.concat(this.generateTextHeader())
          } else {
            const header = `${section.header}`
            lines = lines.concat([
              header,
              '='.repeat(header.length)
            ])
          }
        } else if (section.type === 'total') {
          // Total
          lines = lines.concat([
            this.generateTextTotal()
          ])
        } else if (section.type === 'summary') {
          // Summary
          if (index) {
            lines = lines.concat(['', ''])
          }
          if (parseInt(section.summary.nest, 10)) {
            const header = `${detailedSubheader[section.summary.type]}`
            lines = lines.concat([
              header.concat(' '.repeat(61 - header.length)).concat(duration(getTotalTime()).format('HH:mm')),
              '-'.repeat(66)
            ])
          } else {
            const header = `${subheader[section.summary.type]}`
            lines = lines.concat([
              header.concat(' '.repeat(61 - header.length)).concat(duration(getTotalTime()).format('HH:mm')),
              '-'.repeat(66)
            ])
          }
          const data = Report.summary[section.summary.type]({
            depth: parseInt(section.summary.depth, 10),
            nest: parseInt(section.summary.nest, 10)
          })
          lines = lines.concat(this.generateTextSummary(data))
        }
      })
      const filename = `${this.userName}.${this.context.join(' - ')}.${this.generateTextPeriod()}.report.txt`
      return {
        filename: slugify(filename.replace('.undefined', '')),
        content: lines.join('\n')
      }
    },

    generateTextTotal () {
      const l = this.label('duration', false)
      const total = durationHuman(getTotalTime(), l.hr, l.min, l.sec)
      return `${this.label('report.total')}: ${total}`
    },

    generateTextHeader () {
      const context = this.context.join(taskDelimiter)
      const period = this.generateTextPeriod()
      let title = this.label('report.reportOnFor').replace('%0', context)
      if (!context) {
        title = this.label('report.commonReport')
      }
      if (context) {
        const header = `${title}${period ? ', ' + period : ''}`
        return [
          header,
          '='.repeat(header.length)
        ]
      } else {
        const header = `${title}${period ? ', ' + period : ''}`
        return [
          header,
          '='.repeat(header.length)
        ]
      }
    },

    generateTextPeriod () {
      if (Storage.entries.length) {
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
            return `${from.format('LL')} - ${to.format('LL')}`
          }
        } else {
          if (from.year() === to.year()) {
            if (from.month() === to.month()) {
              return `${from.format('MMMM')} ${from.format('D')}-${to.format('D YYYY')}`
            } else {
              return `${from.format('MMMM D')} - ${to.format('MMMM D YYYY')}`
            }
          } else {
            return `${from.format('LL')} - ${to.format('LL')}`
          }
        }
      }
    },

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
      const maxSpace = isShort ? 30 : 60
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
      const subheader = {
        'daysTasks': this.label('report.headerDaysTasks'),
        'tasks': this.label('report.headerTasks'),
        'days': this.label('report.headerDays')
      }
      const detailedSubheader = {
        'daysTasks': this.label('report.headerDetailedDaysTasks'),
        'tasks': this.label('report.headerDetailedTasks')
      }
      let lines = []
      structure.forEach((section, index) => {
        if (section.type === 'text') {
          lines = lines.concat(section.text)
        } else if (section.type === 'total') {
          lines = lines.concat(this.generateMarkdownTotal())
        } else if (section.type === 'header') {
          // Header
          if (index) {
            lines = lines.concat([''])
          }
          if (!section.header) {
            lines = lines.concat(this.generateMarkdownHeader())
          } else {
            const header = `${section.header}`
            lines = lines.concat([
              `# ${header}`,
              ''
            ])
          }
        }
        if (section.type === 'summary') {
          // Subheader
          if (parseInt(section.summary.nest, 10)) {
            lines = lines.concat(['', `## ${detailedSubheader[section.summary.type]}`, ''])
          } else {
            lines = lines.concat(['', `## ${subheader[section.summary.type]}`, ''])
          }

          // Table
          const data = Report.summary[section.summary.type]({
            depth: parseInt(section.summary.depth, 10),
            nest: parseInt(section.summary.nest, 10)
          })
          lines = lines.concat(this.generateMarkdownSummary(data))
        }
      })
      const filename = `${this.userName}.${this.context.join(' - ')}.${this.generateMarkdownPeriod()}.report.md`
      return {
        filename: slugify(filename.replace('.undefined', '')),
        content: lines.join('\n')
      }
    },

    generateMarkdownTotal () {
      const l = this.label('duration', false)
      const total = durationHuman(getTotalTime(), l.hr, l.min, l.sec)
      return `${this.label('report.total')}: ${total}`
    },

    generateMarkdownHeader () {
      const context = this.context.join(taskDelimiter)
      const period = this.generateMarkdownPeriod()
      let title = this.label('report.reportOnFor').replace('%0', context)
      if (!context) {
        title = this.label('report.commonReport')
      }
      if (context) {
        return [
          `# ${title}${period ? ', ' + period : ''}`,
          ''
        ]
      } else {
        return [
          `# ${title}${period ? ', ' + period : ''}`,
          ''
        ]
      }
    },

    generateMarkdownPeriod () {
      if (Storage.entries.length) {
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
  },
  mixins: [
    i18nLabel
  ]
}

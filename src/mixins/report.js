import moment from 'moment'
import slugify from 'slugify'
import { mapGetters, mapMutations } from 'vuex'
import { taskDelimiter } from '@/store/ui'
import { Storage } from '@/store/storage'
import { duration, durationHuman } from '@/utils/duration'
import i18nLabel from '@/mixins/i18n-label'
import Report from '@/report'
import FileSaver from 'file-saver'
import MyExcel from '@/utils/myexcel'
import bus from '@/event-bus'

function getTotalTime () {
  return Storage.entries.reduce((total, entry) => {
    return total + (new Date(entry.stop).getTime() - new Date(entry.start).getTime())
  }, 0)
}

function isDaysTasks (item) {
  return item.type.match(/day/) && item.type.match(/task/) && item.type.match(/nest/)
}

function parseSummariesInfo (summaries) {
  const info = {
    maxNest: 0,
    hasDayTasks: false
  }
  summaries.forEach(summary => {
    info.maxNest = Math.max(info.maxNest, getMaxNest(summary))
    if (summary[0] && isDaysTasks(summary[0])) {
      info.hasDayTasks = true
    }
  })
  return info
}

function getMaxNest (summaries, nest = 0) {
  let maxNest = nest
  summaries.forEach(summary => {
    if (summary.children) {
      maxNest = Math.max(maxNest, getMaxNest(summary.children, nest + 1))
    }
  })
  return maxNest
}

function generateArray (length, value) {
  if (value) {
    return 'x'.repeat(length - 1).split('x').map(i => JSON.parse(JSON.stringify(value)))
  } else {
    return 'x'.repeat(length - 1).split('x')
  }
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
      'locale',
      'userName',
      'currentView',
      'reportFormat',
      'reportStructure',
      'context'
    ])
  },
  methods: {
    downloadReportWithCurrentParams () {
      if (!Storage.entries.length) {
        bus.$emit('toast', { content: 'Nothing to report - no entries' })
        this.closeModal()
        return
      }
      let report
      let blob
      if (this.reportFormat === 'markdown') {
        report = this.generateMarkdownReport(this.reportStructure)
      } else if (this.reportFormat === 'plaintext') {
        report = this.generateTextReport(this.reportStructure)
      } else if (this.reportFormat === 'spreadsheet') {
        report = this.generateSpreadsheetReport(this.reportStructure)
        const xlsx = this.convertToExcelReport(report.content, report.info)
        xlsx.generate(report.filename)
        return
      }
      if (this.reportFormat === 'markdown' || this.reportFormat === 'plaintext') {
        blob = new Blob([report.content], { type: 'text/plain;charset=utf-8' })
      } else {
        blob = new Blob([report.content], { type: 'application/octet-stream' })
      }
      if (!blob) {
        alert('No blob')
        return
      }
      FileSaver.saveAs(blob, report.filename)
    },

    generateReportWithCurrentParams () {
      if (this.reportFormat === 'markdown') {
        return this.generateMarkdownReport(this.reportStructure)
      } else if (this.reportFormat === 'plaintext') {
        return this.generateTextReport(this.reportStructure)
      }
    },

    //
    // Spreadsheet
    //

    generateSpreadsheetReport (structure) {
      // Collect info
      // Has any summary price enabled?
      // If yes, then 3 columns per level
      // What is deepest tree?
      // This will set global layout (total spreadsheet columns)
      const info = {
        priceEnabled: Boolean(this.price)
      }
      info.colsPerLevel = info.priceEnabled ? 3 : 2
      // To get max depth, we need to create report data first
      let summaries = []
      structure.forEach(section => {
        if (section.type === 'summary') {
          summaries.push(Report.summary[section.summary.type]({
            depth: parseInt(section.summary.depth, 10),
            nest: parseInt(section.summary.nest, 10)
          }))
        }
      })
      Object.assign(info, parseSummariesInfo(summaries))
      info.totalColumns = (info.maxNest + 1) * info.colsPerLevel
      // Now start creating sheet
      let sheet = []
      structure.forEach((section, index) => {
        if (section.type === 'header') {
          sheet = sheet.concat(this.generateHeaderRows(info))
        } else if (section.type === 'summary') {
          const summary = summaries.shift()
          // Create subheader
          const subheader = this.generateSummarySubheaderRows({
            info,
            section,
            summary
          })
          // Create table
          const table = this.generateSpreadsheetSummaryRows({
            info,
            section,
            summary
          })
          table[0].forEach(item => { item.border = 'thick' })
          // Add rows to align main task names
          if (section.summary.type === 'tasks') {
            for (let r = 0; r < subheader.length; r++) {
              if (subheader[r].length < info.totalColumns) {
                const l = info.totalColumns - subheader[r].length
                for (let c = 0; c < l; c++) {
                  subheader[r].unshift('')
                }
              }
            }
            for (let r = 0; r < table.length; r++) {
              if (table[r].length < info.totalColumns) {
                const l = info.totalColumns - table[r].length
                for (let c = 0; c < l; c++) {
                  table[r].unshift('')
                }
              }
            }
          } else if (section.summary.type === 'daysTasks') {
            for (let r = 0; r < subheader.length; r++) {
              if (subheader[r].length < info.totalColumns) {
                const l = info.totalColumns - subheader[r].length
                for (let c = 0; c < l; c++) {
                  if (info.priceEnabled) {
                    subheader[r].splice(3, 0, this.generateCell({
                      value: '',
                      type: 'string subheader',
                      sectionType: 'daysTasks',
                      border: subheader[r][0].border
                    }))
                  } else {
                    subheader[r].splice(2, 0, this.generateCell({
                      value: '',
                      type: 'string subheader',
                      sectionType: 'daysTasks',
                      border: subheader[r][0].border
                    }))
                  }
                }
              }
            }
            for (let r = 0; r < table.length; r++) {
              if (table[r].length < info.totalColumns) {
                const l = info.totalColumns - table[r].length
                for (let c = 0; c < l; c++) {
                  if (info.priceEnabled) {
                    table[r].splice(3, 0, this.generateCell({
                      value: '',
                      type: 'string',
                      sectionType: 'daysTasks',
                      border: table[r][0].border
                    }))
                  } else {
                    table[r].splice(2, 0, this.generateCell({
                      value: '',
                      type: 'string',
                      sectionType: 'daysTasks',
                      border: table[r][0].border
                    }))
                  }
                }
              }
            }
          }

          sheet = sheet.concat(subheader).concat(table)
          sheet = sheet.concat([
            generateArray(info.totalColumns),
            generateArray(info.totalColumns)
          ])
        }
      })
      // add another space
      sheet.unshift(generateArray(info.totalColumns))
      sheet.unshift(generateArray(info.totalColumns))
      sheet.forEach(row => row.unshift(''))
      const filename = `${this.userName}.${this.context.join(' - ')}.${this.generateMarkdownPeriod()}.report.xlsx`
      return {
        filename: slugify(filename.replace('.undefined', '')),
        content: sheet,
        info
      }
    },

    generateCommonHeader () {
      const context = this.context.join(taskDelimiter)
      const period = this.generateTextPeriod()
      let title = this.label('report.reportOnFor').replace('%0', context)
      if (!context) {
        title = this.label('report.commonReport')
      }
      return `${title}${period ? ', ' + period : ''}`
    },

    generateHeaderRows (info) {
      let header = generateArray(info.totalColumns)
      const dur = getTotalTime()
      if (info.priceEnabled) {
        header[header.length - 1] = this.generateCell({
          value: Math.ceil(dur * this.price / 3600000),
          type: 'price',
          sectionType: 'header'
        })
        header[header.length - 2] = this.generateCell({
          value: dur,
          type: 'duration',
          sectionType: 'header'
        })
      } else {
        header[header.length - 1] = this.generateCell({
          value: dur,
          type: 'duration',
          sectionType: 'header'
        })
      }
      header[0] = this.generateCell({
        value: this.generateCommonHeader(),
        type: 'string',
        sectionType: 'header'
      })

      if (this.price) {
        header[header.length - 3] = this.generateCell({
          value: this.price,
          type: 'value perhour',
          sectionType: 'header'
        })
      }
      const labels = generateArray(header.length, this.generateCell({
        type: 'string small',
        sectionType: 'header',
        value: ''
      }))
      if (this.price) {
        labels[header.length - 1].value = this.label('report.totalMoney', false)
        labels[header.length - 2].value = this.label('report.totalTime', false)
        labels[header.length - 2].type += ' center'
        labels[header.length - 3].value = this.label('report.moneyPerHour', false)
      } else {
        labels[header.length - 1].value = this.label('report.totalTime', false)
        labels[header.length - 1].type += ' center'
      }
      return [
        labels,
        header,
        generateArray(info.totalColumns),
        generateArray(info.totalColumns)
      ]
    },

    generateSummarySubheaderRows ({ info, section, summary }) {
      const subheader = {
        'daysTasks': this.label('report.headerDaysTasks'),
        'tasks': this.label('report.headerTasks'),
        'days': this.label('report.headerDays')
      }
      const detailedSubheader = {
        'daysTasks': this.label('report.headerDetailedDaysTasks'),
        'tasks': this.label('report.headerDetailedTasks')
      }
      let title
      if (!parseInt(section.summary.nest, 10)) {
        title = subheader[section.summary.type]
      } else {
        title = detailedSubheader[section.summary.type]
      }
      let length = (getMaxNest(summary) + 1) * info.colsPerLevel
      const row = generateArray(length, this.generateCell({
        value: '',
        type: 'string subheader',
        sectionType: section.summary.type
      }))
      const dur = getTotalTime()
      row[0] = this.generateCell({
        value: title,
        type: 'string subheader',
        sectionType: section.summary.type
      })
      if (info.priceEnabled) {
        row[row.length - 1] = this.generateCell({
          value: Math.ceil(dur * this.price / 3600000),
          type: 'price subheader',
          sectionType: section.summary.type
        })
        row[row.length - 2] = this.generateCell({
          value: dur,
          type: 'duration subheader',
          sectionType: section.summary.type
        })
      } else {
        row[row.length - 1] = this.generateCell({
          value: dur,
          type: 'duration subheader',
          sectionType: section.summary.type
        })
      }
      return [row]
    },

    generateSpreadsheetSummaryRows ({ info, section, summary, depth = 0, totalLength }) {
      let table = []
      const length = totalLength || ((getMaxNest(summary) + 1) * info.colsPerLevel)
      summary.forEach((item, index) => {
        const row = generateArray(length, {
          value: '',
          type: 'string',
          sectionType: section.summary.type
        })
        const pos = depth * (this.price ? 3 : 2)
        row[pos] = this.generateCell({
          value: item.value,
          type: 'string',
          sectionType: section.summary.type
        })
        row[pos + 1] = this.generateCell({
          value: item.duration,
          type: 'duration',
          sectionType: section.summary.type
        })
        if (info.priceEnabled) {
          row[pos + 2] = this.generateCell({
            value: Math.ceil(item.duration * this.price / 3600000),
            type: 'price',
            sectionType: section.summary.type
          })
        }
        table.push(row)
        if (item.children && item.children.length) {
          const rows = this.generateSpreadsheetSummaryRows({
            info,
            section,
            summary: item.children,
            depth: depth + 1,
            totalLength: length
          })
          const firstRow = rows.shift()
          for (let i = 0; i < row.length; i++) {
            row[i] = row[i].value ? row[i] : firstRow[i]
          }
          row.forEach(item => {
            item.border = depth ? 'thin' : 'medium'
          })
          table = table.concat(rows)
        }
      })
      return table
    },

    generateCell ({ value, type, sectionType, border }) {
      const cell = { value, type, sectionType }
      if (value instanceof Date) {
        cell.type = 'date'
      } else if (!type) {
        cell.type = 'string'
      }
      if (sectionType) {
        cell.sectionType = sectionType
      }
      if (border) {
        cell.border = border
      }
      return cell
    },

    convertToExcelReport (table, info) {
      const curr = {
        rub: '# ##0 [$₽-419]',
        cny: '[$￥-804] # ##0',
        eur: '# ##0 [$€-40C]',
        usd: '[$$-409] # ##0'
      }
      const xlsx = MyExcel.new('Arial 10')
      // fix empty last cells in trees
      for (let r = 0; r < table.length; r++) {
        let rowSectionType
        for (let c = 0; c < table[r].length; c++) {
          if (table[r][c] && table[r][c].value) {
            rowSectionType = table[r][c].sectionType
            break
          }
        }
        if (rowSectionType && rowSectionType !== 'days' && rowSectionType !== 'header' && table[r][table[r].length - 1] && !table[r][table[r].length - 1].value) {
          let dur
          let price
          for (let i = table[r].length - 1; i > -1; i--) {
            if (table[r][i].value) {
              if (this.price) {
                price = table[r][i]
                dur = table[r][i - 1]
              } else {
                dur = table[r][i]
              }
              break
            }
          }
          if (price && dur) {
            table[r][table[r].length - 2] = JSON.parse(JSON.stringify(dur))
            table[r][table[r].length - 1] = JSON.parse(JSON.stringify(price))
          } else if (dur) {
            table[r][table[r].length - 1] = JSON.parse(JSON.stringify(dur))
          }
        }
      }

      table.forEach((row, r) => {
        row.forEach((cell, c) => {
          xlsx.set(0, undefined, r, 20)
          // Set cells
          const style = {
            align: 'L C',
            font: 'Arial 10 #333333',
            fill: '#f8f8f8'
          }
          const props = {
            sheet: 0,
            row: r,
            column: c,
            value: (cell ? cell.value : '')
          }
          if (cell) {
            if (cell.type.match(/date/)) {
              props.value = moment(props.value).format('D MMMM').replace(' г.', '')
            } else if (cell.type.match(/duration/)) {
              props.value = duration(props.value).format('HH:mm')
              style.align = 'C C'
              style.font = style.font.replace('#333333', '#888888')
            } else if (cell.type.match(/price/)) {
              style.format = '# ##0'
              if (c < table[0].length - 3 && cell.sectionType !== 'days') {
                style.align = 'C C'
              } else {
                style.align = 'R C'
              }
              style.font = style.font.replace('#333333', '#333333') + ' B'
            }
            if (cell.sectionType === 'header') {
              style.font = style.font.replace('10', '18') + ' B'
              xlsx.set(0, undefined, r, 30)
              if (cell.type.match(/price/) || cell.type.match(/duration/)) {
                style.font = style.font.replace('18', '12')
              }
              if (cell.type.match(/price/)) {
                // style.align = 'R T'
                style.format = curr[this.currency]
              }
              if (cell.type.match(/perhour/)) {
                style.font = style.font.replace('18', '10')
                style.font = style.font.replace(' B', '')
                if (cell.type.match(/value/)) {
                  // style.font = style.font.replace('#333333', '#C23D0C')
                  style.font = style.font.replace('10', '12') + ' B'
                  style.format = curr[this.currency]
                  style.align = 'R C'
                }
              } else if (cell.type.match(/small/)) {
                style.font = style.font.replace('18', '10')
                style.font = style.font.replace(' B', '')
                style.align = 'R C'
                if (cell.type.match(/center/)) {
                  style.align = 'C C'
                }
              }
            }
            if (cell.type.match(/subheader/)) {
              style.font = style.font.replace('10', '12') + ' B'
              if (cell.type.match(/string/) && cell.sectionType !== 'days') {
                // style.font = style.font.replace('12', '14')
              }
              // style.align = style.align.replace(/C$/, 'T')
              if (cell.type.match(/price/)) {
                // style.align = 'R T'
                style.format = curr[this.currency]
              }
              // style.fill = '#dcdcdc'
              xlsx.set(0, undefined, r, 30)
            }
            if (cell.border === 'thick') {
              style.border = 'none,none,thick #444444,none'
            } else if (cell.border === 'medium') {
              style.border = 'none,none,medium #444444,none'
            } else if (cell.border === 'thin') {
              // style.border = 'none,none,thin #333333,none'
            }
          }
          if ((c - 1) % (this.price ? 3 : 2) === 0 && c < info.totalColumns - (this.price ? 3 : 2)) {
            xlsx.set(0, c, undefined, 20)
          }
          if ((c - 1) % (this.price ? 3 : 2) === 1) {
            xlsx.set(0, c, undefined, 9)
          }
          if ((c - 1) % (this.price ? 3 : 2) === 2) {
            xlsx.set(0, c, undefined, 12)
          }
          if (!cell || !cell.value) {
            // style.border = 'thin #ffffff,thin #ffffff,none,none'
          }
          props.style = xlsx.addStyle(style)
          xlsx.set(props)
        })
      })
      xlsx.set(0, info.totalColumns + 1 - (this.price ? 3 : 2), undefined, 60)
      if (this.price) {
        xlsx.set(0, info.totalColumns, undefined, 13)
      }
      table.forEach((row, index) => {
        while (row.length <= info.totalColumns + 1) {
          row.push('')
          xlsx.set({
            sheet: 0,
            row: index,
            column: row.length - 1,
            value: '',
            style: xlsx.addStyle({
              fill: '#f8f8f8'
            })
          })
        }
      })
      return xlsx
    },

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
      const line = `${this.label('report.total')}: ${total}`
      const space = ' '.repeat(33 - line.length * 0.5)
      return space + line + space
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
        const space = ' '.repeat(33 - header.length * 0.5)
        return [
          space + header + space,
          space + '='.repeat(header.length) + space
        ]
      } else {
        const header = `${title}${period ? ', ' + period : ''}`
        const space = ' '.repeat(33 - header.length * 0.5)
        return [
          space + header + space,
          space + '='.repeat(header.length) + space
        ]
      }
    },

    generateTextPeriod () {
      if (Storage.entries.length) {
        const from = moment(Storage.entries.slice(-1)[0].start)
        const to = moment(Storage.entries[0].start)
        if (this.locale === 'ru') {
          if (from.year() === to.year()) {
            if (from.month() === to.month() && from.date() === to.date()) {
              return `${from.format('LL')}`
            } else if (from.month() === to.month()) {
              return `${from.format('D')}-${to.format('D MMMM YYYY')}`
            } else {
              return `${from.format('D MMMM')} - ${to.format('D MMMM YYYY')}`
            }
          } else {
            return `${from.format('LL')} - ${to.format('LL')}`
          }
        } else {
          if (from.year() === to.year()) {
            if (from.month() === to.month() && from.date() === to.date()) {
              return `${from.format('LL')}`
            } else if (from.month() === to.month()) {
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
      const maxSpace = isShort ? 60 : 60
      const space = (name.length < maxSpace ? ' .'.repeat(parseInt((maxSpace - name.length) * 0.5, 10)) : ' .')
      const addon = (name.length % 2 === 1 ? ' ' : '')
      const line = `${name}${addon}${space} ${d}`
      // const s = ' '.repeat(33 - line.length * 0.5)
      return [line]
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
            if (from.month() === to.month() && from.date() === to.date()) {
              return `${from.format('LL')}`
            } else if (from.month() === to.month()) {
              return `${from.format('D')}-${to.format('D MMMM YYYY')}`
            } else {
              return `${from.format('D MMMM')} - ${to.format('D MMMM YYYY')}`
            }
          } else {
            return `${from.format('LLL')} - ${to.format('LLL')}`
          }
        } else {
          if (from.year() === to.year()) {
            if (from.month() === to.month() && from.date() === to.date()) {
              return `${from.format('LL')}`
            } else if (from.month() === to.month()) {
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
    ...mapMutations([
      'closeModal'
    ])
  },
  mixins: [
    i18nLabel
  ]
}

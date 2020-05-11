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
import numberFilter from '@/utils/number-filter'
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
    return 'x'.repeat((length > 0 ? length : 1) - 1).split('x').map(i => JSON.parse(JSON.stringify(value)))
  } else {
    return 'x'.repeat((length > 0 ? length : 1) - 1).split('x')
  }
}

function fullDateRange (from, to, locale) {
  if (locale === 'ru') {
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

function monthRange (from, to) {
  if (from.year() === to.year()) {
    if (from.month() === to.month()) {
      return `${from.format('MMMM YYYY')}`
    } else {
      return `${from.format('MMMM')}-${to.format('MMMM YYYY')}`
    }
  } else {
    return `${from.format('MMMM YYYY')} - ${to.format('MMMM YYYY')}`
  }
}

function yearRange (from, to) {
  if (from.year() === to.year()) {
    return `${from.format('YYYY')}`
  } else {
    return `${from.format('YYYY')}-${to.format('YYYY')}`
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
      'currencySymbol',
      'price',
      'currency',
      'locale',
      'userName',
      'currentView',
      'reportFormat',
      'reportStructure',
      'context',
      'isInterval',
      'intervalStart',
      'intervalStop',
      'previewTextColumnWidth',
      'previewTextShortColumnWidth',
      'reportPerHour',
      'reportCost',
      'reportPeriod',
      'reportDuration',
      'reportSortBy'
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

    generateReportTitleString () {
      if (this.context && this.context.length) {
        return this.label('report.reportOnFor')
          .replace('%0', this.context.join(taskDelimiter))
      }
      return this.label('report.commonReport')
    },

    generatePeriodString () {
      let from
      let to
      if (this.isInterval) {
        from = this.intervalStart ? moment(this.intervalStart) : null
        to = this.intervalStop ? moment(this.intervalStop) : null
        if (from && to) {
          return fullDateRange(from, to, this.locale)
        } else if (from) {
          return `${this.label('report.from', false)} ${from.format('LL')}`
        } else if (to) {
          return `${this.label('report.until', false)} ${to.format('LL')}`
        } else {
          return `${this.label('report.allTime', false)}`
        }
      } else if (Storage.entries.length && this.currentView !== 'tasks') {
        from = moment(Storage.entries.slice(-1)[0].start)
        to = moment(Storage.entries[0].start)
        if (this.currentView === 'storage') {
          return `${from.format('LLL').replace(' г.', '')} - ${to.format('LLL').replace(' г.', '')}`
        } else if (this.currentView === 'years') {
          return yearRange(from, to)
        } else if (this.currentView === 'months') {
          return monthRange(from, to)
        } else {
          return fullDateRange(from, to, this.locale)
        }
      }
      return this.label('report.allTime', false)
    },

    generateCommonHeaderString () {
      const header = this.generateReportTitleString()
      if (this.reportPeriod) {
        const period = this.generatePeriodString()
        return header + ', ' + period
      }
      return header
    },

    generateShortTime (time) {
      return duration(time).format('HH:mm')
    },

    generateHumanTime (time) {
      const l = this.label('duration', false)
      return durationHuman(time, l.hr, l.min, l.sec)
    },

    generatePricePerHour () {
      let price = (this.price ? this.price : 0)
      if (this.isCurrencySymbolBefore) {
        price = this.currencySymbol + ' ' + numberFilter(price)
      } else {
        price = numberFilter(price) + ' ' + this.currencySymbol
      }
      return `${price} ${this.label('price.perHour', false)}`
    },

    generateCost (time) {
      let cost = parseInt((this.price ? this.price : 0) * (time / 3600000))
      if (this.isCurrencySymbolBefore) {
        cost = this.currencySymbol + ' ' + numberFilter(cost)
      } else {
        cost = numberFilter(cost) + ' ' + this.currencySymbol
      }
      return cost
    },

    generateTotal (time, { identCost = false } = {}) {
      let dur = this.reportDuration ? this.generateShortTime(time) : ''
      let cost = this.reportCost ? this.generateCost(time) : ''
      if (identCost && cost.length < 9) {
        cost = (' '.repeat(9) + cost).slice(-9)
      }
      if (this.reportDuration && this.reportCost) {
        return `${dur} = ${cost}`
      }
      return `${dur}${cost.trim()}`
    },

    generateFormula (time = getTotalTime()) {
      const price = this.reportPerHour ? this.generatePricePerHour(time) : ''
      const cost = this.reportCost ? this.generateCost(time) : ''
      const dur = this.reportDuration ? this.generateHumanTime(time) : ''
      if (this.reportDuration && this.reportCost) {
        return `${dur}${price ? ' x ' : ''}${price} = ${cost}`
      }
      return `${dur}${cost}`
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
      info.colsPerLevel = this.reportDuration && this.reportCost ? 3 : 2
      // To get max depth, we need to create report data first
      let summaries = []
      structure.forEach(section => {
        if (section.type === 'summary') {
          summaries.push(Report.summary[section.summary.type]({
            depth: parseInt(section.summary.depth, 10),
            nest: parseInt(section.summary.nest, 10),
            sortBy: this.reportSortBy
          }))
        }
      })
      Object.assign(info, parseSummariesInfo(summaries))
      info.totalColumns = (info.maxNest + 1) * info.colsPerLevel
      // Now start creating sheet
      let sheet = []
      // First, if we need to show pricePerHour and we do not have
      // it in structure, add it
      if (this.reportPerHour) {
        let headerFirst = false
        let totalFound = false
        structure.forEach((section, index) => {
          if (index === 0 && section.type === 'header') {
            headerFirst = true
          }
          if (section.type === 'total') {
            totalFound = true
          }
        })
        if (!totalFound) {
          structure.splice(!headerFirst ? 0 : 1, 0, { type: 'total' })
        }
      }
      structure.forEach((section, index) => {
        if (section.type === 'header') {
          sheet = sheet.concat(this.generateHeaderRows({ info }))
          sheet = sheet.concat([
            generateArray(info.totalColumns),
            generateArray(info.totalColumns)
          ])
        } else if (section.type === 'total') {
          sheet.pop()
          sheet = sheet.concat(this.generateTotalRows({ info }))
          sheet = sheet.concat([
            generateArray(info.totalColumns),
            generateArray(info.totalColumns)
          ])
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
                  subheader[r].splice(info.colsPerLevel, 0, this.generateCell({
                    value: '',
                    type: 'string subheader',
                    sectionType: 'daysTasks',
                    border: subheader[r][0].border
                  }))
                }
              }
            }
            for (let r = 0; r < table.length; r++) {
              if (table[r].length < info.totalColumns) {
                const l = info.totalColumns - table[r].length
                for (let c = 0; c < l; c++) {
                  table[r].splice(info.colsPerLevel, 0, this.generateCell({
                    value: '',
                    type: 'string',
                    sectionType: 'daysTasks',
                    border: table[r][0].border
                  }))
                }
              }
            }
          }
          subheader[0][subheader[0].length - (info.colsPerLevel - 1)].rowsDown = table.length
          if (info.colsPerLevel === 3) {
            subheader[0][subheader[0].length - 1].rowsDown = table.length
          }
          sheet = sheet.concat(subheader).concat(table)
          sheet = sheet.concat([
            generateArray(info.totalColumns),
            generateArray(info.totalColumns)
          ])
        }
      })
      // add another space
      // sheet.unshift(generateArray(info.totalColumns))
      sheet.unshift(generateArray(info.totalColumns))
      sheet.forEach(row => row.unshift(''))
      const filename = `${this.userName}.${this.context.join(' - ')}.${this.generatePeriodString()}.report.xlsx`
      return {
        filename: slugify(filename.replace('.undefined', '')),
        content: sheet,
        info
      }
    },

    generateHeaderRows ({ info }) {
      let header = generateArray(info.totalColumns, this.generateCell({
        value: '',
        type: 'string',
        sectionType: 'header'
      }))
      header[0] = this.generateCell({
        value: this.generateReportTitleString(),
        type: 'string',
        sectionType: 'header'
      })
      if (this.reportPeriod) {
        const periodString = this.generatePeriodString()
        const period = generateArray(info.totalColumns, this.generateCell({
          value: '',
          type: 'string',
          sectionType: 'header period'
        }))
        period[0] = this.generateCell({
          value: periodString,
          type: 'string',
          sectionType: 'header period'
        })
        return [
          header,
          period
        ]
      }
      return [header]
    },

    generateTotalRows ({ info }) {
      const labels = generateArray(info.totalColumns, this.generateCell({
        type: 'string small',
        sectionType: 'total',
        value: ''
      }))
      const total = generateArray(info.totalColumns, this.generateCell({
        type: 'string',
        sectionType: 'total',
        value: ''
      }))
      if (this.reportDuration && this.reportCost) {
        labels[info.totalColumns - 1].value = this.label('report.totalMoney', false)
        total[info.totalColumns - 1].value = parseInt((getTotalTime() / 3600000) * this.price)
        total[info.totalColumns - 1].type = 'price'

        labels[info.totalColumns - 2].value = this.label('report.totalTime', false)
        labels[info.totalColumns - 2].type += ' center'
        total[info.totalColumns - 2].value = getTotalTime()
        total[info.totalColumns - 2].type = 'duration'
        if (this.reportPerHour) {
          labels[info.totalColumns - 3].value = this.label('report.moneyPerHour', false)
          total[info.totalColumns - 3].value = this.price
          total[info.totalColumns - 3].type += ' perhour'
        }
      } else if (this.reportCost) {
        labels[info.totalColumns - 1].value = this.label('report.totalMoney', false)
        total[info.totalColumns - 1].value = parseInt((getTotalTime() / 3600000) * this.price)
        total[info.totalColumns - 1].type = 'price'
      } else {
        labels[info.totalColumns - 1].value = this.label('report.totalTime', false)
        labels[info.totalColumns - 1].type += ' center'
        total[info.totalColumns - 1].value = getTotalTime()
        total[info.totalColumns - 1].type = 'duration'
      }
      return [
        labels,
        total
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
      if (this.reportDuration && this.reportCost) {
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
      } else if (this.reportCost) {
        row[row.length - 1] = this.generateCell({
          value: Math.ceil(dur * this.price / 3600000),
          type: 'price subheader',
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
        const pos = depth * info.colsPerLevel
        row[pos] = this.generateCell({
          value: item.value,
          type: 'string',
          sectionType: section.summary.type
        })
        if (this.reportDuration && this.reportCost) {
          row[pos + 1] = this.generateCell({
            value: item.duration ? item.duration : 0,
            type: 'duration',
            sectionType: section.summary.type
          })
          row[pos + 2] = this.generateCell({
            value: item.duration ? Math.ceil(item.duration * this.price / 3600000) : 0,
            type: 'price',
            sectionType: section.summary.type
          })
        } else if (this.reportCost) {
          row[pos + 1] = this.generateCell({
            value: item.duration ? Math.ceil(item.duration * this.price / 3600000) : 0,
            type: 'price',
            sectionType: section.summary.type
          })
        } else {
          row[pos + 1] = this.generateCell({
            value: item.duration ? item.duration : 0,
            type: 'duration',
            sectionType: section.summary.type
          })
        }
        table.push(row)
        let rows = []
        if (item.children && item.children.length) {
          rows = this.generateSpreadsheetSummaryRows({
            info,
            section,
            summary: item.children,
            depth: depth + 1,
            totalLength: length
          })
          const firstRow = rows.shift()
          for (let i = 0; i < row.length; i++) {
            row[i] = (row[i].value !== '' ? row[i] : firstRow[i])
          }
          row.forEach(item => {
            item.border = depth ? 'thin' : 'medium'
          })
          table = table.concat(rows)
        }
        if (item.children) {
          row[pos + 1].childrenRows = rows.length
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
        rub: '#,##0 [$₽-419]',
        cny: '[$￥-804] #,##0',
        eur: '#,##0 [$€-40C]',
        usd: '[$$-409] #,##0'
      }
      const xlsx = MyExcel.new('Arial 10')
      // fix empty last cells in tree-view,
      // when root task has no children,
      // so we need to duplicate it's value to
      // end of row (where all durations
      // and costs aligned in non-days summaries)
      for (let r = 0; r < table.length; r++) {
        let rowSectionType
        for (let c = 0; c < table[r].length; c++) {
          if (table[r][c] && table[r][c].value) {
            rowSectionType = table[r][c].sectionType
            break
          }
        }
        if (rowSectionType && !rowSectionType.match(/days/) && !rowSectionType.match(/header/) && !rowSectionType.match(/total/) && table[r][table[r].length - 1] && !table[r][table[r].length - 1].value) {
          let dur
          let price
          for (let i = table[r].length - 1; i > -1; i--) {
            if (table[r][i].value || table[r][i].value === 0) {
              if (this.reportDuration && this.reportCost) {
                price = table[r][i]
                dur = table[r][i - 1]
              } else if (this.reportCost) {
                price = table[r][i]
              } else {
                dur = table[r][i]
              }
              break
            }
          }
          if (price && dur) {
            table[r][table[r].length - 2] = JSON.parse(JSON.stringify(dur))
            table[r][table[r].length - 1] = JSON.parse(JSON.stringify(price))
          } else if (price) {
            table[r][table[r].length - 1] = JSON.parse(JSON.stringify(price))
          } else {
            table[r][table[r].length - 1] = JSON.parse(JSON.stringify(dur))
          }
        }
      }

      const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

      // Find cell address with price per hour
      let perHourAddress
      for (let r = 0; r < table.length; r++) {
        for (let c = 0; c < table[r].length; c++) {
          if (table[r][c] && table[r][c].type.match(/perhour/)) {
            perHourAddress = `${abc[c]}${r + 1}`
            break
          }
        }
        if (perHourAddress) {
          break
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
            // common
            if (cell.type.match(/date/)) {
              // DAY
              props.value = moment(props.value).format('D MMMM').replace(' г.', '')
            } else if (cell.type.match(/duration/)) {
              // DURATION
              props.value = props.value ? props.value / (24 * 3600000) : 0
              // if had children, sum time from last column
              let formula
              if (cell.childrenRows !== undefined) {
                const lastDurationColumn = info.totalColumns - (this.reportDuration && this.reportCost ? 1 : 0)
                const from = `${abc[lastDurationColumn]}${r + 1}`
                const to = `${abc[lastDurationColumn]}${r + 1 + cell.childrenRows}`
                formula = `=SUM(${from}:${to})`
                props.value = formula
              }
              style.align = 'C C'
              style.font = style.font.replace('#333333', '#888888')
              style.format = '[h]:mm'
            } else if (cell.type.match(/price/)) {
              // COST
              let formula
              if (this.reportDuration && this.reportCost) {
                const durationCellAddress = `${abc[c - 1]}${r + 1}`
                formula = `=${durationCellAddress}*24*${this.reportPerHour ? perHourAddress : this.price}`
              } else if (cell.childrenRows !== undefined) {
                const lastColumn = info.totalColumns
                const from = `${abc[lastColumn]}${r + 1}`
                const to = `${abc[lastColumn]}${r + 1 + cell.childrenRows}`
                formula = `=SUM(${from}:${to})`
              }
              props.value = formula || cell.value
              style.format = '#,##0'
              if (c < table[0].length - 3 && cell.sectionType !== 'days') {
                style.align = 'C C'
              } else {
                style.align = 'R C'
              }
              style.font = style.font.replace('#333333', '#333333') + ' B'
            }
            // can be subheader and price
            if (cell.type.match(/subheader/)) {
              // SUBHEADER
              // if it is price, is has already formula to
              // get from time near
              style.font = style.font.replace('10', '12') + ' B'
              let formula = cell.value
              if (cell.rowsDown !== undefined) {
                const from = `${abc[c]}${r + 2}`
                const to = `${abc[c]}${r + 2 + cell.rowsDown}`
                formula = `=SUM(${from}:${to})`
              }
              const costOnly = !this.reportDuration && this.reportCost
              if (cell.type.match(/duration/) || (cell.type.match(/price/) && costOnly)) {
                props.value = formula
              }
              if (cell.type.match(/price/)) {
                style.format = curr[this.currency]
              }
              xlsx.set(0, undefined, r, 30)
            }
            if (cell.sectionType === 'total') {
              // TOTAL
              if (cell.type.match(/price/) || cell.type.match(/duration/)) {
                style.font = style.font.replace('10', '12') + ' B'
              }
              if (cell.type.match(/price/) || cell.type.match(/perhour/)) {
                style.align = 'R C'
                style.format = curr[this.currency]
              }
              if (cell.type.match(/perhour/)) {
                style.font = 'Arial 12 #333333 B'
              }
              if (cell.type.match(/small/)) {
                style.font = style.font.replace(' B', '')
                style.align = 'R C'
                if (cell.type.match(/center/)) {
                  style.align = 'C C'
                }
              }
            } else if (cell.sectionType.match(/header/)) {
              // HEADER
              if (info.totalColumns <= 2) {
                style.font = style.font.replace('10', '12') + ' B'
                style.wrap = true
                xlsx.set({ row: r, value: 50 })
              } else if (info.totalColumns <= 3) {
                style.font = style.font.replace('10', '14') + ' B'
                style.wrap = true
                xlsx.set({ row: r, value: 50 })
              } else {
                style.font = style.font.replace('10', '18') + ' B'
                xlsx.set(0, undefined, r, 30)
              }
              if (cell.sectionType.match(/period/)) {
                style.font = style.font.replace('12', '10')
                style.font = style.font.replace('14', '12')
                style.font = style.font.replace('18', '14')
                style.font = style.font.replace(' B', '')
                xlsx.set(0, undefined, r, 20)
              }
              // xlsx.addMerge(0, `${abc[c]}${r + 1}:${abc[c + info.totalColumns - 1]}${r + 1}`)
            }
            if (cell.border === 'thick') {
              style.border = 'none,none,thick #444444,none'
            } else if (cell.border === 'medium') {
              style.border = 'none,none,medium #444444,none'
            }
          }
          if ((c - 1) % (info.colsPerLevel) === 0 && c < info.totalColumns - (info.colsPerLevel)) {
            xlsx.set(0, c, undefined, 20)
          }
          if ((c - 1) % (info.colsPerLevel) === 1) {
            xlsx.set(0, c, undefined, 9)
          }
          if ((c - 1) % (info.colsPerLevel) === 2) {
            xlsx.set(0, c, undefined, 12)
          }
          props.style = xlsx.addStyle(style)
          props.value = props.value || ''
          xlsx.set(props)
        })
      })
      if (info.totalColumns < 4) {
        xlsx.set(0, info.totalColumns + 1 - (info.colsPerLevel), undefined, 35)
      } else {
        xlsx.set(0, info.totalColumns + 1 - (info.colsPerLevel), undefined, 60)
      }
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
      // const columnWidth = this.previewTextColumnWidth - 1
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
          lines = lines.concat([section.text, ''])
        } else if (section.type === 'header') {
          // Header
          if (index) {
            lines = lines.concat([''])
          }
          if (!section.header) {
            lines = lines
              .concat(this.generateTextHeader())
              .concat([''])
          } else {
            const header = `${section.header}`
            lines = lines.concat([
              header,
              '='.repeat(header.length),
              ''
            ])
          }
        } else if (section.type === 'total') {
          // Total
          lines = lines
            .concat(this.generateTextTotal())
            .concat([''])
        } else if (section.type === 'summary') {
          // Summary
          if (index) {
            lines = lines.concat([''])
          }
          const total = this.generateTotal(getTotalTime(), { identCost: true })
          if (parseInt(section.summary.nest, 10)) {
            const header = `${detailedSubheader[section.summary.type]}`
            let repeat = this.previewTextColumnWidth - 1 - header.length - total.length
            if (section.summary.type === 'days') {
              repeat = this.previewTextShortColumnWidth - header.length - total.length
            }
            const line = header
              .concat(' '.repeat(repeat < 0 ? 0 : repeat))
              .concat(total)
            lines = lines.concat([line, '-'.repeat(line.length)])
          } else {
            const header = `${subheader[section.summary.type]}`
            let repeat = this.previewTextColumnWidth - 1 - header.length - total.length
            if (section.summary.type === 'days') {
              repeat = this.previewTextShortColumnWidth - header.length - total.length
            }
            const line = header
              .concat(' '.repeat(repeat < 0 ? 0 : repeat))
              .concat(total)
            lines = lines.concat([line, '-'.repeat(line.length)])
          }
          const data = Report.summary[section.summary.type]({
            depth: parseInt(section.summary.depth, 10),
            nest: parseInt(section.summary.nest, 10),
            sortBy: this.reportSortBy
          })
          lines = lines.concat(this.generateTextSummary(data)).concat([''])
        }
      })
      const filename = `${this.userName}.${this.context.join(' - ')}.${this.generatePeriodString()}.report.txt`
      return {
        filename: slugify(filename.replace('.undefined', '')),
        content: lines.join('\n')
      }
    },

    generateTextTotal () {
      const total = this.generateFormula(getTotalTime())
      const line = `${this.label('report.total')}: ${total}`
      const repeat = Math.floor((this.previewTextColumnWidth - 1 - line.length) * 0.5)
      const space = ' '.repeat(repeat < 0 ? 0 : repeat)
      return space + line + space
    },

    generateTextHeader () {
      const header = this.generateCommonHeaderString()
      const columnWidth = this.previewTextColumnWidth - 1
      const repeat = Math.floor((columnWidth - header.length) * 0.5)
      const space = ' '.repeat(repeat < 0 ? 0 : repeat)
      return [
        space + header + space,
        space + '='.repeat(header.length) + space
      ]
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
      const name = moment(item.value).format('D MMM YYYY')
      const total = this.generateTotal(item.duration, { identCost: true })
      let columnWidth = this.previewTextColumnWidth - 1
      if (isShort) {
        columnWidth = this.previewTextShortColumnWidth
      }
      const repeat = columnWidth - name.length - total.length - 2
      const space = (name.length < columnWidth ? '.'.repeat(repeat < 0 ? 0 : repeat) : '.')
      return `${name} ${space} ${total}`.replace(/\.\./g, '. ')
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
      let total = this.generateTotal(item.duration, { identCost: true })
      if (depth) {
        total = this.generateTotal(item.duration)
        const padding = '  '.repeat(depth)
        return `${padding}${name} (${total})`
      } else {
        const columnWidth = this.previewTextColumnWidth - 1
        const repeat = columnWidth - name.length - total.length - 2
        const space = (name.length < columnWidth ? '.'.repeat(repeat < 0 ? 0 : repeat) : '.')
        return `${name} ${space} ${total}`.replace(/\.\./g, '. ')
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
          lines = lines.concat([section.text, ''])
        } else if (section.type === 'total') {
          lines = lines.concat([this.generateMarkdownTotal(), ''])
        } else if (section.type === 'header') {
          if (!section.header) {
            lines = lines.concat([this.generateMarkdownHeader(), ''])
          } else {
            const header = `${section.header}`
            lines = lines.concat([`# ${header}`, ''])
          }
        }
        if (section.type === 'summary') {
          // Subheader
          if (parseInt(section.summary.nest, 10)) {
            lines = lines.concat([`## ${detailedSubheader[section.summary.type]}`, ''])
          } else {
            lines = lines.concat([`## ${subheader[section.summary.type]}`, ''])
          }

          // Table
          const data = Report.summary[section.summary.type]({
            depth: parseInt(section.summary.depth, 10),
            nest: parseInt(section.summary.nest, 10),
            sortBy: this.reportSortBy
          })
          lines = lines.concat(this.generateMarkdownSummary(data)).concat([''])
        }
      })
      const filename = `${this.userName}.${this.context.join(' - ')}.${this.generatePeriodString()}.report.md`
      return {
        filename: slugify(filename.replace('.undefined', '')),
        content: lines.join('\n')
      }
    },

    generateMarkdownTotal () {
      let total = this.generateFormula(getTotalTime())
      return `${this.label('report.total')}: ${total}`
    },

    generateMarkdownHeader () {
      return ['# ' + this.generateCommonHeaderString()]
    },

    generateMarkdownSummary (data) {
      let lines = []
      data.forEach(item => {
        if (item.type.match(/day/)) {
          lines = lines
            .concat(this.generateMarkdownDayLines(item))
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
      const name = moment(item.value).format('DD MMMM YYYY')
      const total = this.generateTotal(item.duration)
      return `**${name}** \`${total}\``.replace(/\.\./g, '. ')
    },

    generateMarkdownTaskLines (item, depth = 0) {
      if (!isNest(item)) {
        return [this.generateMarkdownTaskLine(item, depth)]
      } else if (item.children) {
        let nested = []
        item.children.map(child => {
          nested = nested.concat(this.generateMarkdownTaskLines(child, depth + 1))
        })
        if (!depth) {
          return ['', this.generateMarkdownTaskLine(item, depth)].concat(nested)
        }
        return [this.generateMarkdownTaskLine(item, depth)].concat(nested)
      }
    },

    generateMarkdownTaskLine (item, depth = 0) {
      let name = item.value
      if (name.match(urlRegexp)) {
        name = decodeURIComponent(name.replace(/https?:\/\//, ''))
      }
      let total = this.generateTotal(item.duration)
      if (depth > 1) {
        // If deep nested
        const padding = '  '.repeat(depth)
        return `${padding}- ${name} (${total})`
      } else if (depth === 1) {
        // If 1-level nest
        return `  - ${name} (${total})`
      } else {
        // If root
        total = this.generateTotal(item.duration, { identCost: true })
        return `**${name}** \`${total}\``.replace(/\.\./g, '. ')
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

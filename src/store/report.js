export const defaultSections = {
  header: { type: 'header' },
  total: { type: 'total' },
  // period: { type: 'period' },
  text: { type: 'text' },
  summaryDays: {
    type: 'summary',
    summary: { type: 'days' }
  },
  summaryTasks: {
    type: 'summary',
    summary: { type: 'tasks', depth: 0, nest: 0 }
  },
  summaryDetailedTasks: {
    type: 'summary',
    summary: { type: 'tasks', depth: 0, nest: 1 }
  },
  summaryDaysTasks: {
    type: 'summary',
    summary: { type: 'daysTasks', depth: 1, nest: 0 }
  },
  summaryDetailedDaysTasks: {
    type: 'summary',
    summary: { type: 'daysTasks', depth: 1, nest: 1 }
  }
}

const state = {
  format: 'markdown',
  formats: {
    markdown: true,
    plaintext: true,
    spreadsheet: true,
    document: false,
    html: false,
    pdf: false,
    csv: false
  },
  structure: [
    { type: 'header' },
    { type: 'total' },
    { type: 'summary', summary: { type: 'daysTasks', depth: 2, nest: 0 } },
    { type: 'summary', summary: { type: 'tasks', depth: 0, nest: 0 } },
    { type: 'summary', summary: { type: 'days' } }
  ],
  structures: {
    header: true,
    total: true,
    period: false,
    text: true,
    summary: true
  },
  summaries: {
    days: true,
    tasks: true,
    daysTasks: true
  },
  showReportModal: true,
  previewTextColumnWidth: 70,
  previewTextColumnWidths: [50, 60, 70, 80, 100],
  reportPerHour: true,
  reportCost: true,
  reportDuration: true
}

const getters = {
  reportFormat: state => state.format,
  reportStructure: state => JSON.parse(JSON.stringify(state.structure)),
  showReportModal: state => state.showReportModal,
  previewTextColumnWidth: state => state.previewTextColumnWidth,
  previewTextShortColumnWidth: (state, getters) => {
    return getters.reportCost && getters.reportDuration ? 40 : 35
  },
  reportPerHour: state => state.reportPerHour,
  reportCost: state => state.reportCost,
  reportDuration: state => state.reportDuration,
  reportResult: state => {
    if (state.reportDuration && state.reportCost) {
      return 'report-duration-and-cost'
    } else if (state.reportCost) {
      return 'report-cost-only'
    }
    return 'report-duration-only'
  },
  availableFormatsAsOptions: state => {
    return Object
      .keys(state.formats)
      .filter(key => state.formats[key])
      .map(key => ({ value: key, label: `report.format.${key}` }))
  },
  availableStructuresAsOptions: state => {
    return Object
      .keys(state.structures)
      .filter(key => state.structures[key])
      .map(key => ({ value: key, label: `report.section.${key}` }))
  },
  availableSummariesAsOptions: state => {
    return Object
      .keys(state.summaries)
      .filter(key => state.summaries[key])
      .map(key => ({ value: key, label: `report.summary.${key}` }))
  },
  availablePreviewTextColumnWidthsAsOptions: state => {
    return state.previewTextColumnWidths.map(i => ({ value: i }))
  }
}

const mutations = {
  setReportFormat (state, payload) {
    state.format = payload.format
  },
  setReportStructure (state, payload) {
    state.structure = JSON.parse(JSON.stringify(payload.structure.slice(0)))
  },
  setReportSection (state, payload) {
    state.structure.splice(payload.index, 1, JSON.parse(JSON.stringify(payload.section)))
  },
  setShowReportModal (state, payload) {
    state.showReportModal = payload.showReportModal
  },
  addReportSection (state, payload) {
    state.structure.push(JSON.parse(JSON.stringify(payload.section)))
  },
  removeReportSection (state, payload) {
    state.structure.splice(payload.index, 1)
  },
  clearReportSections (state) {
    state.structure = []
  },
  setReportPerHour (state, payload) {
    state.reportPerHour = payload.reportPerHour
  },
  // setReportCost (state, payload) {
  //   state.reportCost = payload.reportCost
  // },
  // setReportDuration (state, payload) {
  //   state.reportDuration = payload.reportDuration
  // },
  setPreviewTextColumnWidth (state, payload) {
    state.previewTextColumnWidth = payload.previewTextColumnWidth
  },
  setReportResult (state, payload) {
    if (payload.reportResult === 'report-duration-only') {
      state.reportDuration = true
      state.reportCost = false
    } else if (payload.reportResult === 'report-cost-only') {
      state.reportDuration = false
      state.reportCost = true
    } else if (payload.reportResult === 'report-duration-and-cost') {
      state.reportDuration = true
      state.reportCost = true
    } else {
      state.reportDuration = true
      state.reportCost = false
    }
  }
}

export default {
  state,
  getters,
  mutations
}

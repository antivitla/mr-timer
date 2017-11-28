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
  data: []
}

const getters = {
  reportFormat: state => state.format,
  reportStructure: state => JSON.parse(JSON.stringify(state.structure)),
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
  addReportSection (state, payload) {
    state.structure.push(JSON.parse(JSON.stringify(payload.section)))
  },
  removeReportSection (state, payload) {
    state.structure.splice(payload.index, 1)
  },
  clearReportSections (state) {
    state.structure = []
  }
}

export default {
  state,
  getters,
  mutations
}

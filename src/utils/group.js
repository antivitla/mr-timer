import moment from 'moment'

export function parseStartMoment (name, start, formats) {
  const supportedTypes = ['string', 'number', 'function']
  const types = {
    string: name => moment(name, formats),
    number: name => moment().month(parseInt(name, 10)),
    function: name => moment(name())
  }
  let validStart
  if (start && start.isValid()) {
    validStart = start
  } else if (supportedTypes.indexOf(typeof name) > -1) {
    validStart = types[typeof name](name)
  } else {
    validStart = moment()
  }
  return validStart.isValid() ? validStart : moment()
}

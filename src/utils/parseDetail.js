const urlRegexp = /((https?):\/\/.*?(\s|$))/

export default function parseDetail (detail) {
  if (detail.match(urlRegexp)) {
    return decodeURIComponent(detail.replace(/https?:\/\//, ''))
  } else {
    return detail
  }
}

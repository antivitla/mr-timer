export function parseHttpResponse (response) {
  if (response.status === 204) {
    return true
  } else if (response.ok) {
    return response.json()
  } else {
    response.text().then(text => {
      console.warn(response.status, response.statusText, text)
      const errorElement = document.getElementById('debug-error')
      if (errorElement) {
        errorElement.classList.add('active')
        errorElement.innerHTML = text
      }
    })
    throw new Error(response.statusText)
  }
}

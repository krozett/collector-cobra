const keysToFields = (object, sortField) => {
  let keys = Object.keys(object).map((key) => {
    const decoded = decodeURI(key)
    return [key].concat(decoded.split('\x7F'))
  })

  keys.sort((a, b) => {
    let aTitle = cleanFront(a[sortField])
    let bTitle = cleanFront(b[sortField])
    let comp = aTitle.localeCompare(bTitle)

    if (comp > 0) {
      return 1
    }
    else if (comp < 0) {
      return -1
    }
    else {
      return 0
    }
  })

  return keys
}

const cleanFront = (str) => {
  str = str.trim()
  let original = str
  let re = /^(The\s|A\s|An\s|[^a-zA-Z\d])/i

  while (str.match(re)) {
    str = str.replace(re, '')
  }

  return str.length > 0 ? str : original
}

export default keysToFields

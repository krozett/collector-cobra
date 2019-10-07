const sortByField = (object, sortField) => {
  let keys = Object.keys(object).filter(key => !object[key].deleted)

  keys.sort((a, b) => {
    let aTitle = cleanFront(object[a][sortField])
    let bTitle = cleanFront(object[b][sortField])
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

export default sortByField

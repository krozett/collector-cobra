const keysSortedByTitle = object => {
  let keys = Object.keys(object)

  keys.sort((a, b) => {
    let aTitle = cleanFront(object[a].title)
    let bTitle = cleanFront(object[b].title)
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

export default keysSortedByTitle

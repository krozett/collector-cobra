const generateID = (type, item) => {
  const idFields = type.idFormat.fields.map((field) => {
    if (typeof field === 'function') {
      return field(item)
    }
    else {
      return item[field]
    }
  })

  return encodeURI(idFields.join('\x7F').replace(/\//g, '-'))
}

export default generateID

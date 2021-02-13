const timestampToDate = (timestamp) => {
  let dateObj = new Date(timestamp.seconds * 1000)

  const year = dateObj.getUTCFullYear()
  const month = dateObj.getUTCMonth()
  const date = dateObj.getUTCDate()

  return new Date(year, month, date, 0, 0, 0)
}

export default timestampToDate

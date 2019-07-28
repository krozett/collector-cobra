const timestampToDate = (timestamp) => {
  let dateObj = new Date(timestamp.seconds * 1000)

  const year = dateObj.getUTCFullYear()
  const month = dateObj.getUTCMonth()
  const date = dateObj.getUTCDate()

  dateObj.setFullYear(year)
  dateObj.setMonth(month)
  dateObj.setDate(date)
  dateObj.setHours(0)
  dateObj.setMinutes(0)
  dateObj.setSeconds(0)

  return dateObj
}

export default timestampToDate

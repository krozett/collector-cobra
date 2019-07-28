const reFullDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
const reYearOnly = /^[0-9]{4}$/

const parseDateUTC = (val) => {
  // YYYY-MM-DD master race :D
  if (reFullDate.test(val)) {
    const [year, month, date] = val.split('-')
    return new Date(Date.UTC(year, month - 1, date))
  }

  // Year only :(
  else if (reYearOnly.test(val)) {
    return new Date(Date.UTC(val))
  }

  // See if Date can parse it... if not, just use today
  let date = new Date(val)
  if (!date.valueOf()) {
    date = new Date()
  }

  // Always interpret as UTC
  date.setUTCHours(0)
  date.setUTCMinutes(0)
  date.setUTCSeconds(0)

  return date
}

export default parseDateUTC

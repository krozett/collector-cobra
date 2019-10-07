const functions = require('firebase-functions')
const URLSearchParams = require('@ungap/url-search-params')
const fetch = require('node-fetch')

const gameFields = [
  'guid',
  'name',
  'original_release_date',
  'expected_release_year',
  'expected_release_month',
  'expected_release_day',
  'developers',
  'releases'
]

const apiFetch = async (data) => {
  const apiKeys = functions.config().api

  let base
  let params = {}

  switch (data.type) {
    case 'books':
      base = 'https://www.googleapis.com/books/v1/volumes/' + data.id
      break

    case 'games':
      base = 'https://www.giantbomb.com/api/game/' + data.id + '/'
      params = {
        api_key: apiKeys.giantbomb.key,
        format: 'json',
        field_list: gameFields.join(',')
      }
      break

    case 'movies':
      base = 'https://api.themoviedb.org/3/movie/' + data.id
      params = {
        api_key: apiKeys.tmdb.key,
        language: 'en-US'
      }
      break

    case 'music':
      base = 'https://api.discogs.com/releases/' + data.id
      break

    case 'tv':
      base = 'https://api.themoviedb.org/3/tv/' + data.id
      params = {
        api_key: apiKeys.tmdb.key,
        language: 'en-US'
      }
      break

    default:
      const msg = 'Invalid collection type'
      throw new functions.https.HttpsError('invalid-argument', msg)
  }

  const url = base + '?' + new URLSearchParams(params)
  const response = await fetch(url)

  if (!response.ok) {
    const err = await response.text()
    throw new functions.https.HttpsError('internal', err)
  }

  return await response.json()
}

module.exports = apiFetch

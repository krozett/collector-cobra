const { defineString } = require('firebase-functions/params')
const { HttpsError } = require('firebase-functions/v2/https')
const fetch = require('node-fetch')

const comicvineKey = defineString('API_COMICVINE_KEY')
const giantbombKey = defineString('API_GIANTBOMB_KEY')
const tmdbKey = defineString('API_TMDB_KEY')

const gameFields = [
  'guid',
  'name',
  'original_release_date',
  'expected_release_year',
  'expected_release_month',
  'expected_release_day',
  'developers',
  'releases',
]

const comicFields = [
  'name',
  'start_year',
  'publisher',
  'count_of_issues',
  'site_detail_url',
]

const apiFetch = async (request) => {
  let base
  let params = {}
  let msg

  switch (request.data.type) {
    case 'books':
      base = 'https://www.googleapis.com/books/v1/volumes/' + request.data.id
      params = {
        country: 'US',
      }
      break

    case 'comics':
      base = 'https://comicvine.gamespot.com/api/volume/' + request.data.id + '/'
      params = {
        api_key: comicvineKey.value(),
        format: 'json',
        field_list: comicFields.join(','),
      }
      break

    case 'games':
      base = 'https://www.giantbomb.com/api/game/' + request.data.id + '/'
      params = {
        api_key: giantbombKey.value(),
        format: 'json',
        field_list: gameFields.join(','),
      }
      break

    case 'movies':
      base = 'https://api.themoviedb.org/3/movie/' + request.data.id
      params = {
        api_key: tmdbKey.value(),
        language: 'en-US',
      }
      break

    case 'music':
      base = 'https://api.discogs.com/releases/' + request.data.id
      break

    case 'tv':
      base = 'https://api.themoviedb.org/3/tv/' + request.data.id
      params = {
        api_key: tmdbKey.value(),
        language: 'en-US',
      }
      break

    default:
      msg = 'Invalid collection type'
      throw new HttpsError('invalid-argument', msg)
  }

  const url = base + '?' + new URLSearchParams(params).toString()
  const response = await fetch(url)

  if (!response.ok) {
    const err = await response.text()
    throw new HttpsError('internal', err)
  }

  return await response.json()
}

module.exports = apiFetch

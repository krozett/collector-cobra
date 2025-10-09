const { defineString } = require('firebase-functions/params')
const { HttpsError } = require('firebase-functions/v2/https')
const fetch = require('node-fetch')

const comicvineKey = defineString('API_COMICVINE_KEY')
const giantbombKey = defineString('API_GIANTBOMB_KEY')
const tmdbKey = defineString('API_TMDB_KEY')
const discogsKey = defineString('API_DISCOGS_KEY')
const discogsSecret = defineString('API_DISCOGS_SECRET')

const gameFields = [
  'guid',
  'name',
  'original_release_date',
  'expected_release_year',
  'site_detail_url',
]

const comicFields = [
  'name',
  'start_year',
  'site_detail_url',
]

const apiSearch = async (request) => {
  const page = request.data.page || 1
  let base
  let params = {}
  let msg

  switch (request.data.type) {
    case 'books':
      base = 'https://www.googleapis.com/books/v1/volumes'
      params = {
        q: request.data.query,
        country: 'US',
        maxResults: 20,
        startIndex: (page - 1) * 20,
      }
      break

    case 'comics':
      base = 'https://comicvine.gamespot.com/api/volumes/'
      params = {
        api_key: comicvineKey.value(),
        format: 'json',
        field_list: comicFields.join(','),
        filter: 'name:' + request.data.query,
        offset: (page - 1) * 100,
      }
      break

    case 'games':
      base = 'https://www.giantbomb.com/api/games/'
      params = {
        api_key: giantbombKey.value(),
        format: 'json',
        field_list: gameFields.join(','),
        filter: 'name:' + request.data.query,
        offset: (page - 1) * 100,
      }
      break

    case 'movies':
      base = 'https://api.themoviedb.org/3/search/movie'
      params = {
        api_key: tmdbKey.value(),
        language: 'en-US',
        include_adult: true,
        query: request.data.query,
        page,
      }
      break

    case 'music':
      base = 'https://api.discogs.com/database/search'
      params = {
        key: discogsKey.value(),
        secret: discogsSecret.value(),
        type: 'release',
        title: request.data.query,
        page,
      }
      break

    case 'tv':
      base = 'https://api.themoviedb.org/3/search/tv'
      params = {
        api_key: tmdbKey.value(),
        language: 'en-US',
        query: request.data.query,
        page,
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

module.exports = apiSearch

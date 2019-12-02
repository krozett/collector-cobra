const functions = require('firebase-functions')
const URLSearchParams = require('@ungap/url-search-params')
const fetch = require('node-fetch')

const gameFields = [
  'guid',
  'name',
  'original_release_date',
  'expected_release_year',
  'site_detail_url'
]

const comicFields = [
  'name',
  'start_year',
  'site_detail_url'
]

const apiSearch = async (data) => {
  const apiKeys = functions.config().api

  let base
  let params = {}
  let page = data.page || 1
  let msg

  switch (data.type) {
    case 'books':
      base = 'https://www.googleapis.com/books/v1/volumes'
      params = {
        q: data.query,
        country: 'US',
        maxResults: 20,
        startIndex: (page - 1) * 20
      }
      break

    case 'comics':
      base = 'https://comicvine.gamespot.com/api/volumes/'
      params = {
        api_key: apiKeys.comicvine.key,
        format: 'json',
        field_list: comicFields.join(','),
        filter: 'name:' + data.query,
        offset: (page - 1) * 100
      }
      break

    case 'games':
      base = 'https://www.giantbomb.com/api/games/'
      params = {
        api_key: apiKeys.giantbomb.key,
        format: 'json',
        field_list: gameFields.join(','),
        filter: 'name:' + data.query,
        offset: (page - 1) * 100
      }
      break

    case 'movies':
      base = 'https://api.themoviedb.org/3/search/movie'
      params = {
        api_key: apiKeys.tmdb.key,
        language: 'en-US',
        include_adult: true,
        query: data.query,
        page
      }
      break

    case 'music':
      base = 'https://api.discogs.com/database/search'
      params = {
        key: apiKeys.discogs.key,
        secret: apiKeys.discogs.secret,
        type: 'release',
        title: data.query,
        page
      }
      break

    case 'tv':
      base = 'https://api.themoviedb.org/3/search/tv'
      params = {
        api_key: apiKeys.tmdb.key,
        language: 'en-US',
        query: data.query,
        page
      }
      break

    default:
      msg = 'Invalid collection type'
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

module.exports = apiSearch
